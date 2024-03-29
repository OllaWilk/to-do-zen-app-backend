import { NextFunction, Request, Response } from 'express';
export class ValidationError extends Error {}

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err instanceof ValidationError ? 400 : 500).json({
    message:
      err instanceof ValidationError
        ? err.message
        : 'Something went wrong! Please, try again later.',
  });
};
