import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDTO, RegisterDTO } from '../types/auth.types';

export class AuthController {
  // static async register(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const data: RegisterDTO = req.body;
  //     const result = await AuthService.register(data);
  //     res.status(201).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: LoginDTO = req.body;
      const result = await AuthService.login(credentials);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // static async refresh(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { refreshToken } = req.body;
  //     const tokens = await AuthService.refresh(refreshToken);
  //     res.json(tokens);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}