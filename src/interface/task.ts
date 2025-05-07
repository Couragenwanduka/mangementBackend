import { Types } from "mongoose";
export type TaskStatus = 'To Do' | 'Started' | 'In Progress' | 'Done';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Declined';

export interface IComment {
  userId: Types.ObjectId; // User who commented
  commentText: string;    // Text of the comment
  timestamp: Date;        // Time when the comment was made
}

export interface TaskType {
  title: string;
  description: string;
  status?: TaskStatus;
  approvalStatus?: ApprovalStatus;
  createdBy: Types.ObjectId; // Admin
  assignedTo?: Types.ObjectId; // User
  comments?: IComment[]; // Array of comments
}