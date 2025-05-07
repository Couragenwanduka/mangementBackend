import Leave from "../model/leaveModel";
import { ILeave } from "../interface/leave";

class LeaveService {
    private LeaveModel: typeof Leave;

    constructor(LeaveModel: typeof Leave) {
        this.LeaveModel = LeaveModel;
    }

    // Method to create a new leave request
    async createLeave(leave: ILeave) {
        try {
            const newLeave = await this.LeaveModel.create({
                userId: leave.userId,
                startDate: leave.startDate,
                endDate: leave.endDate,
                reason: leave.reason,
                status: leave.status || 'Pending',
            });

            return newLeave;
        } catch (error) {
            console.error("Error creating leave:", error);
            throw new Error("Error creating leave");
        }
    }

    // Method to fetch all leave requests for a specific user with pagination
    async findLeaveByUser(userId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const leaves = await this.LeaveModel.find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }); // Sort by most recent

            const totalLeaves = await this.LeaveModel.countDocuments({ userId });
            const totalPages = Math.ceil(totalLeaves / limit);

            return {
                leaves,
                totalLeaves,
                totalPages,
                currentPage: page,
            };
        } catch (error) {
            console.error("Error fetching leave records:", error);
            throw new Error("Error fetching leave records");
        }
    }

    // Method to update the status of a leave request (e.g., approve or reject)
    async updateLeaveStatus(id: string, status: string) {
        try {
            const updatedLeave = await this.LeaveModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }  // Return the updated leave
            );

            if (!updatedLeave) {
                throw new Error(`Leave request with ID ${id} not found`);
            }

            return updatedLeave;
        } catch (error) {
            console.error("Error updating leave status:", error);
            throw new Error("Error updating leave status");
        }
    }

    // Method to delete a leave request
    async deleteLeave(id: string) {
        try {
            const deletedLeave = await this.LeaveModel.findByIdAndDelete(id);
            if (!deletedLeave) {
                throw new Error(`Leave request with ID ${id} not found`);
            }
            return deletedLeave;
        } catch (error) {
            console.error("Error deleting leave request:", error);
            throw new Error("Error deleting leave request");
        }
    }

    // Method to check if a user has any overlapping leave requests (optional)
    async checkOverlappingLeave(userId: string, startDate: Date, endDate: Date) {
        try {
            const overlappingLeaves = await this.LeaveModel.find({
                userId,
                status: { $in: ['Pending', 'Approved'] }, // Only check Pending or Approved leaves
                $or: [
                    { startDate: { $gte: startDate, $lte: endDate } },
                    { endDate: { $gte: startDate, $lte: endDate } },
                ]
            });

            return overlappingLeaves.length > 0; // Return true if any overlap
        } catch (error) {
            console.error("Error checking overlapping leave:", error);
            throw new Error("Error checking overlapping leave");
        }
    }

    async checkIfOnleave(userId: string , date:Date){
        try{
            const leave = await this.LeaveModel.find({
                userId,
                status: {$in: 'Approved'},
                startDate: { $lte: date },
                endDate: { $gte: date },
            })
            return leave

        }catch(error){
            console.error('Error checking leave', error)
            throw new Error('Error checking leave')
        }
    }
}

export default LeaveService;
