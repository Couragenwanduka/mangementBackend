import { Request, Response } from "express";
import TaskService from "../service/task.service";
import Task from "../model/taskModel";
import { ApprovalStatus, TaskStatus } from "../model/taskModel";
import BadRequest from "../error/error";
import { ResponseHandler } from "../error/response";

class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService(Task);
  }

  // POST /task
  public async createTask(req: Request, res: Response): Promise<Response> {
    try {
        const {title, description, createdBy} = req.body;

        const task = await this.taskService.createTask({title, description, createdBy});
        return ResponseHandler.success(res, 'success', {data: task })
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // GET /task/:id
  public async getTaskById(req: Request, res: Response): Promise<Response> {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  // GET /task/user/:userId
  public async getTasksForUser(req: Request, res: Response): Promise<Response> {
    try {
      const tasks = await this.taskService.getTasksForUser(req.params.userId);
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PATCH /task/:id
  public async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const updatedTask = await this.taskService.updateTask(req.params.id, req.body);
      return res.status(200).json({ message: "Task updated", data: updatedTask });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  // DELETE /task/:id
  public async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await this.taskService.deleteTask(req.params.id);
      return res.status(200).json({ message: "Task deleted", data: deleted });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  // POST /task/:id/comment
  public async addComment(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, commentText } = req.body;
      const task = await this.taskService.addComment(req.params.id, userId, commentText);
      return res.status(200).json({ message: "Comment added", data: task });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PATCH /task/:id/approval
  public async updateApprovalStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { status } = req.body;
      const updatedTask = await this.taskService.updateApprovalStatus(
        req.params.id,
        status as ApprovalStatus
      );
      return res.status(200).json({ message: "Approval status updated", data: updatedTask });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PATCH /task/:id/status
  public async updateTaskStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { status } = req.body;
      const updatedTask = await this.taskService.updateTaskStatus(
        req.params.id,
        status as TaskStatus
      );
      return res.status(200).json({ message: "Task status updated", data: updatedTask });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default TaskController;
 