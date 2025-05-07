import Payroll from "../model/payrollModel";
import { IPayroll } from "../interface/payroll";
import { Types } from "mongoose";

class PayrollService {
  private PayrollModel: typeof Payroll;

  constructor(PayrollModel: typeof Payroll) {
    this.PayrollModel = PayrollModel;
  }

  // Create a payroll record
  async createPayroll(data: IPayroll) {
    try {
      const payroll = await this.PayrollModel.create({
        userId:data.userId,
        salary:data.salary,
        status:data.status,
        deductions:data.deductions,
        netPay:data.netPay,
        month:data.month,
      });
      return payroll;
    } catch (error) {
      console.error("Error creating payroll:", error);
      throw new Error("Error creating payroll");
    }
  }

  // Get payroll for a specific user
  async getPayrollForUser(userId: string) {
    try {
      const payrolls = await this.PayrollModel.find({ userId }).sort({ createdAt: -1 });
      return payrolls;
    } catch (error) {
      console.error("Error retrieving payroll records:", error);
      throw new Error("Error retrieving payroll records");
    }
  }

  // Get all payroll records (for admin)
  async getAllPayrolls() {
    try {
      const payrolls = await this.PayrollModel.find()
        .populate("userId processedBy")
        .sort({ createdAt: -1 });
      return payrolls;
    } catch (error) {
      console.error("Error fetching all payrolls:", error);
      throw new Error("Error fetching all payrolls");
    }
  }

  // Update payroll status to Paid
  async markAsPaid(payrollId: string, processorId: string) {
    try {
      const updated = await this.PayrollModel.findByIdAndUpdate(
        payrollId,
        {
          status: "Paid",
          processedBy: new Types.ObjectId(processorId),
          processedAt: new Date(),
        },
        { new: true }
      );
      return updated;
    } catch (error) {
      console.error("Error updating payroll status:", error);
      throw new Error("Error updating payroll status");
    }
  }

  // Delete a payroll record
  async deletePayroll(payrollId: string) {
    try {
      const deleted = await this.PayrollModel.findByIdAndDelete(payrollId);
      return deleted;
    } catch (error) {
      console.error("Error deleting payroll:", error);
      throw new Error("Error deleting payroll");
    }
  }

  // Find payroll record by ID
  async getPayrollById(payrollId: string) {
    try {
      const record = await this.PayrollModel.findById(payrollId).populate("userId processedBy");
      return record;
    } catch (error) {
      console.error("Error retrieving payroll by ID:", error);
      throw new Error("Error retrieving payroll by ID");
    }
  }
}

export default PayrollService;
