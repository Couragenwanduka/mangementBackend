import { Types, Document } from 'mongoose';
export interface AttendanceType {
    userId: Types.ObjectId;
    date: Date;
    clockIn?: Date;
    clockOut?: Date;
    status: 'Present' | 'Absent' | 'Late';
  }