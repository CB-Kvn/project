import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Config } from './config/config';
import { Logger } from './config/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { PrismaClient } from '@prisma/client';

const app = express();
export const prisma= new PrismaClient();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// Error handling
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await prisma.$connect();
    Logger.info('Connected to database');

    app.listen(Config.port, () => {
      Logger.info(`Server running on port ${Config.port} in ${Config.nodeEnv} mode`);
    });
  } catch (error) {
    Logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();