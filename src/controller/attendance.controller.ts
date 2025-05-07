import { Request, Response, NextFunction } from "express";
import AttendanceService from "../service/attendance.service";
import Attendance from "../model/attendanceModel";
import { ResponseHandler } from "../error/response";
import BadRequest from "../error/error";

class AttendanceController {
    private attendanceService: AttendanceService;

    constructor() {
        this.attendanceService = new AttendanceService(Attendance);
    }

    // POST /attendance
    async createAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, date } = req.body;
    
            const now = new Date();
    
            // Only allow clock-in after 8:00 AM
            const eightAm = new Date();
            eightAm.setHours(8, 0, 0, 0);
    
            if (now < eightAm) {
                throw new BadRequest('You can only clock in after 8:00 AM');
            }
    
            // Determine lateness after 8:30 AM
            const lateThreshold = new Date();
            lateThreshold.setHours(8, 30, 0, 0);
    
            let status: 'Present' | 'Absent' | 'Late' = 'Present';
            if (now > lateThreshold) {
                status = 'Late';
            }
    
            // Prevent multiple clock-ins for the same date
            const existingRecord = await this.attendanceService.findCurrentAttendance(userId, new Date(date));
            if (existingRecord) {
                throw new BadRequest("You have already clocked in today");
            }
    
            const attendance = await this.attendanceService.createAttendance({
                userId,
                clockIn: now,
                date,
                status,
            });
    
            return ResponseHandler.success(res, "Attendance recorded", attendance);
        } catch (error) {
            next(error);
        }
    }
    

    // GET /attendance/:userId?page=1&limit=10
    async getUserAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const records = await this.attendanceService.findAttendanceByUser(userId, page, limit);

            return ResponseHandler.success(res, "Attendance records fetched", records);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /attendance/:id
    async updateAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updated = await this.attendanceService.updateAttendance(id, updateData);

            return ResponseHandler.success(res, "Attendance updated", updated);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /attendance/:id
    async deleteAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const deleted = await this.attendanceService.deleteAttendance(id);

            return ResponseHandler.success(res, "Attendance deleted", deleted);
        } catch (error) {
            next(error);
        }
    }

    // GET /attendance/status/:userId?date=YYYY-MM-DD
    async checkAttendanceStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const dateString = req.query.date as string;

            if (!dateString) {
                throw new BadRequest("Date query is required");
            }

            const date = new Date(dateString);
            const status = await this.attendanceService.checkUserAttendance(userId, date);

            return ResponseHandler.success(res, "Attendance status retrieved", { status });
        } catch (error) {
            next(error);
        }
    }

    async clockOut(req: Request, res: Response, next: NextFunction) {
        try{
            const { userId } = req.params;
            const dateString = req.query.date as string;

            const date = new Date(dateString);
            const now = new Date();

            // 1. Enforce clock-out only after 5:00 PM
            const fivePM = new Date();
            fivePM.setHours(17, 0, 0, 0); // 5:00 PM today

            if (now < fivePM) {
                throw new BadRequest("You can only clock out after 5:00 PM")
            }

            // 2. Find the attendance record
            const record = await this.attendanceService.findCurrentAttendance(userId, date);
            if (!record) {
                throw new BadRequest("Attendance record not found for clock-out")
            }

            const updatedRecord = await this.attendanceService.clockOut(userId, date, now);
            return ResponseHandler.success(res,"Clock-out successful", updatedRecord)
        }catch(error){
            next(error)
        }
    }
}

export default AttendanceController;
