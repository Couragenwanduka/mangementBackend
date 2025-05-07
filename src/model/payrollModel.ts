import { Schema, model, Types, Document } from 'mongoose';
import { IPayroll } from '../interface/payroll';


const PayrollSchema = new Schema<IPayroll>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netPay: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true, // e.g. "May 2025"
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    processedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payroll = model<IPayroll>('Payroll', PayrollSchema);
export default Payroll;
