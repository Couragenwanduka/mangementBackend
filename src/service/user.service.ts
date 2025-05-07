import { UserType } from "../interface/user";
import User from "../model/userModel";

// UserService class
class UserService {
    private UserModel: typeof User;

    // Constructor accepts the User model or other dependencies
    constructor(UserModel: typeof User) {
        this.UserModel = UserModel;
    }

    // Method to save a new user
    async saveUser(user: UserType) {
        try {
            const createUser = await this.UserModel.create({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                position: user.position
            });
            return createUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Error creating user");
        }
    }

    // Method to Find user By Email
    async findUserByEmail(email: string) {
        try {
            const user = await this.UserModel.findOne({ email });
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }
            return user;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    }

    async findUserById(id: string){
        try{
            const user = await this.UserModel.findById(id)
            return user
        }catch(error){
            console.error("Error finding user by id:", error);
            throw error;
        }
    }

    // Paginate method to find users with page and limit parameters, excluding admins
    async findUsers(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const users = await this.UserModel.find({ role: { $ne: 'Admin' } })
                .skip(skip)
                .limit(limit);

            const totalUsers = await this.UserModel.countDocuments({ role: { $ne: 'Admin' } });
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users,
                totalUsers,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Error fetching users");
        }
    }

    // Paginate method to find admins with page and limit parameters
    async findAdmins(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const admin = await this.UserModel.find({ role: { $eq: 'Admin' } })
                .skip(skip)
                .limit(limit);

            const totalUsers = await this.UserModel.countDocuments({ role: { $eq: 'Admin' } });
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                admin,
                totalUsers,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            console.error("Error fetching admins:", error);
            throw new Error("Error fetching admins");
        }
    }

    // Method to make a user an admin
    async makeUserAdmin(id: string) {
        try {
            const admin = await this.UserModel.findByIdAndUpdate(id, { role: "Admin" }, { new: true });
            return admin;
        } catch (error) {
            console.error("Error updating user to admin:", error);
            throw new Error("Error updating user to admin");
        }
    }

    // Method to update user details
    async updateUser(id: string, update: Partial<UserType>) {
        try {
            const updatedUser = await this.UserModel.findByIdAndUpdate(id, update, { new: true });
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Error updating user");
        }
    }

    // Method to update a user's status 
    async updateUserStatus(id: string, status: string) {
        try {
            const updatedUser = await this.UserModel.findByIdAndUpdate(
                id, 
                { status }, 
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error("Error updating user status:", error);
            throw new Error("Error updating user status");
        }
    }
}

export default UserService;
