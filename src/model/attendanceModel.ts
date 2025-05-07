import { Schema, model, Types, Document } from 'mongoose';
import { AttendanceType } from '../interface/attendance';

const AttendanceSchema = new Schema<AttendanceType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    clockIn: {
      type: Date,
    },
    clockOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present',
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = model<AttendanceType>('Attendance', AttendanceSchema);
export default Attendance;
