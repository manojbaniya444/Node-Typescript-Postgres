import { Request, Response, NextFunction } from 'express';

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ message: 'Not Found' });
};

export { notFoundMiddleware };
