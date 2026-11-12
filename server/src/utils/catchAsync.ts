import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Higher-order utility function to wrap asynchronous controller actions.
 * Eliminates repetitive try-catch blocks and forwards errors to the global error handler.
 */
export const catchAsync = (fn: AsyncFunction): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
