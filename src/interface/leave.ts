import { Types, Document } from 'mongoose';
export interface ILeave{
    userId: Types.ObjectId;
    reason: string;
    leaveType: 'Sick' | 'Casual' | 'Annual' | 'Emergency' | 'Other';
    startDate: Date;
    endDate: Date;
    status: 'Pending' | 'Approved' | 'Declined';
    reviewedBy?: Types.ObjectId;
    reviewedAt?: Date;
  }