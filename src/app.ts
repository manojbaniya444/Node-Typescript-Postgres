import { logger } from './utils/logger';
import { errorHandler, limiter, notFoundMiddleware } from './middlewares';
import { config } from './config/env.config';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import userRouter from './routes/user.route';

const app = express();

app.use(
  cors({
    origin: config.url.frontend,
  })
);
app.use(express.json());
app.use(compression());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'Healthy' });
});
app.use('/api/user', limiter, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);

export { app };
