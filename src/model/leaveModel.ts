import { Schema, model, Types} from 'mongoose';
import { ILeave } from '../interface/leave';

const LeaveSchema = new Schema<ILeave>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Sick', 'Casual', 'Annual', 'Emergency', 'Other'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Declined'],
      default: 'Pending',
    },
    reviewedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Leave = model<ILeave>('Leave', LeaveSchema);
export default Leave;
