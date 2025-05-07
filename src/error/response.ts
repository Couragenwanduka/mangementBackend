import { Response } from 'express';

export class ResponseHandler {
  static success(
    res: Response,
    message: string = 'Success',
    data: any = {},
    statusCode: number = 200
  ) {
    return res.status(statusCode).json({
      message,
      ...data,
    });
  }
}
