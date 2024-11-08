import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpException } from './error.middleware';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpException(400, 'Validation error: ' + JSON.stringify(errors.array()));
  }
  next();
};