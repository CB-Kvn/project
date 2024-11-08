import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').optional().trim().notEmpty(),
    validateRequest,
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validateRequest,
  ],
  AuthController.login
);

router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty(),
    validateRequest,
  ],
  AuthController.refresh
);

router.post(
  '/logout',
  authMiddleware,
  AuthController.logout
);

export const authRoutes = router;