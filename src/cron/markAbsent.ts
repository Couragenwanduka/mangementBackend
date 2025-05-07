import cron from "node-cron";
import Attendance from "../model/attendanceModel";
import User from "../model/userModel";
import { startOfDay, endOfDay, format } from "date-fns";
import { sentAutoMatedMail } from "../helper/nodemailer";
import LeaveService from "../service/leave.service";
import Leave from "../model/leaveModel";

cron.schedule("1 17 * * 1-5", async () => {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    const formattedDate = format(today, "yyyy-MM-dd");

    const leaveService = new LeaveService(Leave);

    const users = await User.find();
    const admins = await User.find({ role: "Admin" });

    const absentees = [];

    for (const user of users) {
      const record = await Attendance.findOne({
        userId: user._id,
        date: { $gte: start, $lte: end },
      });

      const isOnLeave = await leaveService.checkIfOnleave(user._id.toString(), today);

      if (!record && (!isOnLeave || isOnLeave.length === 0)) {
        await Attendance.create({
          userId: user._id,
          date: today,
          status: "Absent",
          clockIn: null,
          clockOut: null,
        });

        absentees.push({
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          position: user.position || "N/A", // fallback if no position
        });
      }
    }

    if (absentees.length > 0) {
      for (const admin of admins) {
        await sentAutoMatedMail(admin.email, absentees, formattedDate);
      }
    }

    console.log("Absent users marked and emails sent to admins.");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
