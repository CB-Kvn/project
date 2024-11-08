import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Config } from '../config/config';
import { HttpException } from './error.middleware';
import { JwtPayload } from '../types/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException(401, 'Authentication token missing');
    }

    const decoded = jwt.verify(token, Config.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(new HttpException(401, 'Invalid authentication token'));
  }
};