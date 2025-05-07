import Attendance from "../model/attendanceModel";
import { AttendanceType } from "../interface/attendance";

class AttendanceService {
    private AttendanceModel: typeof Attendance;

    constructor(AttendanceModel: typeof Attendance) {
        this.AttendanceModel = AttendanceModel;
    }

    // Method to create a new attendance record
    async createAttendance(attendance: AttendanceType) {
        try {
            const newAttendance = await this.AttendanceModel.create({
                userId: attendance.userId,
                clockIn: attendance.clockIn,
                date: attendance.date,
            });

            return newAttendance;
        } catch (error) {
            console.error("Error creating attendance:", error);
            throw new Error("Error creating attendance");
        }
    }

    // Method to fetch all attendance records for a specific user (pagination can be added)
    async findAttendanceByUser(userId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const attendanceRecords = await this.AttendanceModel.find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 }); // Sort by the most recent date

            const totalRecords = await this.AttendanceModel.countDocuments({ userId });
            const totalPages = Math.ceil(totalRecords / limit);

            return {
                attendanceRecords,
                totalRecords,
                totalPages,
                currentPage: page,
            };
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            throw new Error("Error fetching attendance records");
        }
    }

    // Method to update an attendance record (e.g., marking attendance)
    async updateAttendance(id: string, update: Partial<AttendanceType>) {
        try {
            const updatedAttendance = await this.AttendanceModel.findByIdAndUpdate(
                id,
                update,
                { new: true }
            );
            if (!updatedAttendance) {
                throw new Error(`Attendance record with ID ${id} not found`);
            }
            return updatedAttendance;
        } catch (error) {
            console.error("Error updating attendance:", error);
            throw new Error("Error updating attendance");
        }
    }

    // Method to delete an attendance record
    async deleteAttendance(id: string) {
        try {
            const deletedAttendance = await this.AttendanceModel.findByIdAndDelete(id);
            if (!deletedAttendance) {
                throw new Error(`Attendance record with ID ${id} not found`);
            }
            return deletedAttendance;
        } catch (error) {
            console.error("Error deleting attendance record:", error);
            throw new Error("Error deleting attendance record");
        }
    }

    // Method to check attendance status for a specific user on a given date
    async checkUserAttendance(userId: string, date: Date) {
        try {
            const attendance = await this.AttendanceModel.findOne({ userId, date });
            return attendance ? "Present" : "Absent"; // If record exists, they are present
        } catch (error) {
            console.error("Error checking attendance:", error);
            throw new Error("Error checking attendance");
        }
    }

    // Method to clock out a user for a given date
    async clockOut(userId: string, date: Date, clockOutTime: Date) {
        try {
            const attendanceRecord = await this.AttendanceModel.findOneAndUpdate(
                { userId, date },
                { clockOut: clockOutTime },
                { new: true }
            );
            return attendanceRecord;
        } catch (error) {
            console.error("Error during clock-out:", error);
            throw new Error("Error during clock-out");
        }
    }

    async findCurrentAttendance(userId: string, date: Date,){
        try{
            const attendanceRecord = await this.AttendanceModel.findOne({userId, date})
            return attendanceRecord
        }catch(error){
            console.error("Error during clock-out:", error);
            throw new Error("Error during clock-out");
        }
    }

}

export default AttendanceService;
