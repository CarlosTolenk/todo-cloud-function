import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../errors/app-error';
import { errorResponse } from './api-response';
import { HTTP_STATUS } from './http-status';

export const notFoundHandler = (_request: Request, response: Response): void => {
  response
    .status(HTTP_STATUS.NOT_FOUND)
    .json(errorResponse('NOT_FOUND', 'Route not found'));
};

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    response
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(
        errorResponse('VALIDATION_ERROR', 'Invalid request data', error.flatten()),
      );
    return;
  }

  if (error instanceof AppError) {
    response
      .status(error.statusCode)
      .json(errorResponse(error.code, error.message, error.details));
    return;
  }

  response
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(errorResponse('INTERNAL_SERVER_ERROR', 'Unexpected server error'));
};
