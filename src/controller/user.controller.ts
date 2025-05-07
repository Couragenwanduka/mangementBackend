import BadRequest from "../error/error";
import { Request, Response, NextFunction } from "express";
import UserService from "../service/user.service";
import User from "../model/userModel";
import { sendWelcomeMail } from "../helper/nodemailer";
import { comparePassword } from "../helper/bcrypt";
import generateToken from "../helper/jwt";
import { ResponseHandler } from "../error/response";
import { UserType } from "../interface/user";
import { uploadToCloudinary } from "../helper/cloudinary";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService(User);
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, position } = req.body;

            const existingUser = await this.userService.findUserByEmail(email);
            if (existingUser) {
                throw new BadRequest('User already exists');
            }

            await this.userService.saveUser({ firstName, lastName, email, position });
            await sendWelcomeMail(email, firstName);

            return ResponseHandler.success(res, 'User created successfully');
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const existingUser = await this.userService.findUserByEmail(email);
            if (!existingUser || !existingUser.password) {
                throw new BadRequest('Invalid credentials');
            }

            const isMatch = comparePassword(password, existingUser.password);
            if (!isMatch) {
                throw new BadRequest('Invalid credentials');
            }

            const token = generateToken(existingUser);
            return ResponseHandler.success(res, 'Login successful', { token });
        } catch (error) {
            next(error);
        }
    }

    async user(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const user = await this.userService.findUsers(page, limit);
            return ResponseHandler.success(res, 'Users fetched successfully', user);
        } catch (error) {
            next(error);
        }
    }

    async admin(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const admin = await this.userService.findAdmins(page, limit);

            return ResponseHandler.success(res, 'Admins fetched successfully', {
                users: admin.admin,
                totalUsers: admin.totalUsers,
                totalPages: admin.totalPages,
                currentPage: admin.currentPage
            });
        } catch (error) {
            next(error);
        }
    }

    async makeUserAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const makeAdmin = await this.userService.makeUserAdmin(id);
            if (!makeAdmin) {
                throw new BadRequest('An error occurred while updating role');
            }

            return ResponseHandler.success(res, 'User promoted to admin');
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, status } = req.body;

            const updatedStatus = await this.userService.updateUserStatus(id, status);
            if (!updatedStatus) {
                throw new BadRequest('An error occurred while updating status');
            }

            return ResponseHandler.success(res, 'User status updated');
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { email, firstName, lastName, password } = req.body;

            const existingUser = await this.userService.findUserById(id);
            if (!existingUser) {
                throw new BadRequest("User does not exist");
            }

            const updateData: Partial<UserType> = {};

            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (email) updateData.email = email;
            if (password) updateData.password = password;

            if (req.file) {
                const fileBuffer = req.file.buffer;
                const result = await uploadToCloudinary(fileBuffer, 'courageGroup/users');
                updateData.picture = result.secure_url;
            }

            const updatedUser = await this.userService.updateUser(id, updateData);

            return ResponseHandler.success(res, 'User updated successfully', { user: updatedUser });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
