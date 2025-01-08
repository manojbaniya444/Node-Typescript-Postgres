import { logger } from './utils/logger';
import { errorHandler, limiter } from './middlewares';
import { config } from './config/env.config';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';

const app = express();

app.use(
  cors({
    origin: config.url.frontend,
  })
);
app.use(express.json());
app.use(compression());
app.use('/api', limiter);
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

// define other api endpoints...

app.use(errorHandler);

export { app };
