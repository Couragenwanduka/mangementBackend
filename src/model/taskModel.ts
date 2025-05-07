import { Schema, model, Types, Document } from 'mongoose';

export type TaskStatus = 'To Do' | 'Started' | 'In Progress' | 'Done';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Declined';

export interface IComment {
  userId: Types.ObjectId; // User who commented
  commentText: string;    // Text of the comment
  timestamp: Date;        // Time when the comment was made
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  approvalStatus: ApprovalStatus;
  createdBy: Types.ObjectId; // Admin
  assignedTo?: Types.ObjectId; // User
  comments: IComment[]; // Array of comments
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['To Do', 'Started', 'In Progress', 'Done'],
      default: 'To Do',
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Declined'],
      default: 'Pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Must be an Admin
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: 'User', // Assigned user (optional initially)
    },
    comments: [CommentSchema], // Embedded comments schema
  },
  {
    timestamps: true,
  }
);

const Task = model<ITask>('Task', TaskSchema);
export default Task;
