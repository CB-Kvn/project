import { Request, Response, NextFunction } from 'express';
import { Logger } from '../config/logger';

export class HttpException extends Error {
  status: number;
  message: string;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  Logger.error(`[${status}] ${message}`);

  res.status(status).json({
    status,
    message,
  });
};