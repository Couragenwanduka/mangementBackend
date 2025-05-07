import { Request, Response, NextFunction } from "express";
import LeaveService from "../service/leave.service";
import Leave from "../model/leaveModel";
import BadRequest from "../error/error";
import { ResponseHandler } from "../error/response";

class LeaveController {
  private leaveService: LeaveService;

  constructor() {
    this.leaveService = new LeaveService(Leave);
  }

  // POST /leave
  public async createLeave(req: Request, res: Response, next:NextFunction){
    try {
      const { userId, startDate, endDate, reason } = req.body;

      const isOverlapping = await this.leaveService.checkOverlappingLeave(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      if (isOverlapping) {
        throw new BadRequest('Leave overlaps with an existing request')
      }

      const leave = await this.leaveService.createLeave({
        userId,
        startDate,
        endDate,
        reason,
        leaveType: "Other", // Default leaveType added
        status: "Pending"
      });
      ResponseHandler.success(res, 'success',{day:leave} )
    } catch (error: any) {
      next(error)
    }
  }

  // GET /leave/:userId?page=1&limit=10
  public async getLeaveByUser(req: Request, res: Response, next:NextFunction){
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const leaveData = await this.leaveService.findLeaveByUser(userId, page, limit);
      return  ResponseHandler.success(res,'succes', leaveData)
    } catch (error: any) {
      next(error)
    }
  }

  // PATCH /leave/:id/status
  public async updateLeaveStatus(req: Request, res: Response, next:NextFunction){
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedLeave = await this.leaveService.updateLeaveStatus(id, status);
      return  ResponseHandler.success(res,'succes', {data: updatedLeave})
    } catch (error) {
      next(error)
    }
  }

  // DELETE /leave/:id
  public async deleteLeave(req: Request, res: Response, next:NextFunction){
    try {
      const { id } = req.params;

      await this.leaveService.deleteLeave(id);
      return  ResponseHandler.success(res,'succes')
    } catch (error: any) {
      next(error)
    }
  }

  // GET /leave/check/:userId/:date
  public async checkIfOnLeave(req: Request, res: Response, next:NextFunction){
    try {
      const { userId, date } = req.params;

      const leave = await this.leaveService.checkIfOnleave(userId, new Date(date));
      return  ResponseHandler.success(res,'succes',{ onLeave: leave.length > 0, data: leave } )
    } catch (error) {
      next(error)
    }
  }
}

export default LeaveController;
