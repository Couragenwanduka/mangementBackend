import cron from "node-cron";
import { startOfMonth, endOfMonth } from "date-fns";
import Payroll from "../model/payrollModel";
import PayrollService from "../service/payroll.service";
import User from "../model/userModel";
import positionSalaries from "../helper/salary";
import Attendance from "../model/attendanceModel";
import { sendPayrollMail } from "../helper/nodemailer";

const payrollService = new PayrollService(Payroll);

const DEDUCTION_PER_LATENESS = 50; // amount deducted per lateness

cron.schedule('0 0 28 * *', async () => {
  try {
    console.log('Running monthly payroll...');

    const users = await User.find();

    const now = new Date();

    for (const user of users) {
      const { _id, position } = user;

      const salaryEntry = positionSalaries.find(p => p.position === position);
      if (!salaryEntry) continue;

      const baseSalary = salaryEntry.salary;

      const attendances = await Attendance.find({
        userId: _id,
        createdAt: {
          $gte: startOfMonth(now),
          $lte: endOfMonth(now)
        },
        status: 'Late'
      });

      const latenessCount = attendances.length;
      const totalDeduction = latenessCount * DEDUCTION_PER_LATENESS;
      const finalSalary = baseSalary - totalDeduction;

      await payrollService.createPayroll({
        userId: _id,
        salary: baseSalary,
        deductions: totalDeduction,
        netPay: finalSalary,
        month: (now.getMonth() + 1).toString(),
        status: 'Pending'
      });
    }

    // Notify Admins
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
      await sendPayrollMail(admin.email, admin.firstName, now.getMonth() + 1, now.getFullYear());
    }

    console.log('Payroll process completed and admin notified.');
  } catch (error) {
    console.error('Payroll process failed:', error);
  }
});
