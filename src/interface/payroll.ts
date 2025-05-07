import { Types, Document } from 'mongoose';

export interface IPayroll {
    userId: Types.ObjectId;
    salary: number;
    bonuses?: number;
    deductions?: number;
    netPay: number;
    month: string; // e.g. "May 2025"
    status: 'Pending' | 'Paid';
    processedBy?: Types.ObjectId; // Admin
    processedAt?: Date;
  }