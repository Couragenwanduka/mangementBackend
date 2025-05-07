import Task from "../model/taskModel";
import { TaskType, TaskStatus, ApprovalStatus } from "../interface/task";
import { Types } from "mongoose";

class TaskService {
  private TaskModel: typeof Task;

  constructor(TaskModel: typeof Task) {
    this.TaskModel = TaskModel;
  }

  // Create a new task
  async createTask(data: TaskType) {
    try {
      const task = await this.TaskModel.create({
        title:data.title,
        description:data.description,
        createdBy:data.createdBy
      });
      return task;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Error creating task");
    }
  }

  // Get a task by ID
  async getTaskById(taskId: string) {
    try {
      const task = await this.TaskModel.findById(taskId).populate("createdBy assignedTo comments.userId");
      if (!task) throw new Error("Task not found");
      return task;
    } catch (error) {
      console.error("Error retrieving task:", error);
      throw new Error("Error retrieving task");
    }
  }

  // Get tasks created by admin or assigned to a user
  async getTasksForUser(userId: string) {
    try {
      const tasks = await this.TaskModel.find({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
      }).sort({ createdAt: -1 });
      return tasks;
    } catch (error) {
      console.error("Error retrieving tasks:", error);
      throw new Error("Error retrieving tasks");
    }
  }

  // Update a task
  async updateTask(taskId: string, updates: Partial<TaskType>) {
    try {
      const updatedTask = await this.TaskModel.findByIdAndUpdate(taskId, updates, {
        new: true,
      });
      if (!updatedTask) throw new Error("Task not found");
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Error updating task");
    }
  }

  // Delete a task
  async deleteTask(taskId: string) {
    try {
      const deletedTask = await this.TaskModel.findByIdAndDelete(taskId);
      if (!deletedTask) throw new Error("Task not found");
      return deletedTask;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Error deleting task");
    }
  }

  // Add a comment to a task
  async addComment(taskId: string, userId: string, commentText: string) {
    try {
      const comment = {
        userId: new Types.ObjectId(userId),
        commentText,
        timestamp: new Date(),
      };
      const updatedTask = await this.TaskModel.findByIdAndUpdate(
        taskId,
        { $push: { comments: comment } },
        { new: true }
      );
      if (!updatedTask) throw new Error("Task not found");
      return updatedTask;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw new Error("Error adding comment");
    }
  }

  // Update approval status
  async updateApprovalStatus(taskId: string, status: ApprovalStatus) {
    try {
      const updatedTask = await this.TaskModel.findByIdAndUpdate(
        taskId,
        { approvalStatus: status },
        { new: true }
      );
      if (!updatedTask) throw new Error("Task not found");
      return updatedTask;
    } catch (error) {
      console.error("Error updating approval status:", error);
      throw new Error("Error updating approval status");
    }
  }

  // Update task status (To Do, Started, etc.)
  async updateTaskStatus(taskId: string, status: TaskStatus) {
    try {
      const updatedTask = await this.TaskModel.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }
      );
      if (!updatedTask) throw new Error("Task not found");
      return updatedTask;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw new Error("Error updating task status");
    }
  }
}

export default TaskService;
