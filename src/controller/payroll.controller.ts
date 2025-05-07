import { Request, Response, NextFunction } from "express";
import PayrollService from "../service/payroll.service";
import Payroll from "../model/payrollModel";
import BadRequest from "../error/error";
import { ResponseHandler } from "../error/response";

class PayrollController {
  private payrollService: PayrollService;

  constructor() {
    this.payrollService = new PayrollService(Payroll);
  }

  async getPayrollForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const records = await this.payrollService.getPayrollForUser(userId);
      return ResponseHandler.success(res, "Payroll records fetched", records);
    } catch (error) {
      next(error);
    }
  }

  async getAllPayrolls(_req: Request, res: Response, next: NextFunction) {
    try {
      const records = await this.payrollService.getAllPayrolls();
      return ResponseHandler.success(res, "All payroll records fetched", records);
    } catch (error) {
      next(error);
    }
  }

  async markAsPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const { payrollId, processorId  } = req.body;

      if (!processorId) {
        throw new BadRequest("Processor ID missing from request");
      }

      const updated = await this.payrollService.markAsPaid(payrollId, processorId);
      return ResponseHandler.success(res, "Payroll marked as paid", updated);
    } catch (error) {
      next(error);
    }
  }

  async deletePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payrollId } = req.params;

      const deleted = await this.payrollService.deletePayroll(payrollId);
      return ResponseHandler.success(res, "Payroll deleted", deleted);
    } catch (error) {
      next(error);
    }
  }

  async getPayrollById(req: Request, res: Response, next: NextFunction) {
    try {
      const { payrollId } = req.params;

      const record = await this.payrollService.getPayrollById(payrollId);
      return ResponseHandler.success(res, "Payroll record retrieved", record);
    } catch (error) {
      next(error);
    }
  }
}

export default PayrollController;
