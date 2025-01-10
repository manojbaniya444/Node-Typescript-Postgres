import { Request, Response, NextFunction } from 'express';
import { config, Environment } from '../config/env.config';
import { logger } from '../utils/logger';
import { BaseError } from '../utils/errors/base.error';

// error handling middleware

// custom error
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // logging the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // for the environment development show all the errors
  if (config.app.env === Environment.DEV) {
    // for the base error
    if (err instanceof BaseError) {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    }

    // for the database error
    if (err.name === 'DATABASE_ERROR') {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        code: 'Database Error',
      });
    }

    // for the authentication error
    if (err.name === 'AUTHENTICATION_ERROR') {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        code: 'Authentication failed check credential',
      });
    }
  } else {
    // for the production setup
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Something went wrong',
    });
  }
};
