import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../errors/app-error';
import type { Logger } from '../logging/logger';
import { errorResponse } from './api-response';
import { HTTP_STATUS } from './http-status';
import { buildRequestLogContext } from './request-context';

export const createNotFoundHandler =
  (logger: Logger) =>
  (request: Request, response: Response): void => {
    logger.warn('Route not found', buildRequestLogContext(request, response));

    response
      .status(HTTP_STATUS.NOT_FOUND)
      .json(errorResponse('NOT_FOUND', 'Route not found'));
  };

export const createErrorHandler =
  (logger: Logger) =>
  (
    error: unknown,
    request: Request,
    response: Response,
    _next: NextFunction,
  ): void => {
    if (error instanceof ZodError) {
      logger.warn('Validation error', {
        ...buildRequestLogContext(request, response),
        details: error.flatten(),
      });

      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          errorResponse('VALIDATION_ERROR', 'Invalid request data', error.flatten()),
        );
      return;
    }

    if (error instanceof AppError) {
      logger.warn('Handled application error', {
        ...buildRequestLogContext(request, response),
        code: error.code,
        details: error.details,
      });

      response
        .status(error.statusCode)
        .json(errorResponse(error.code, error.message, error.details));
      return;
    }

    logger.error('Unhandled error', {
      ...buildRequestLogContext(request, response),
      error,
    });

    response
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse('INTERNAL_SERVER_ERROR', 'Unexpected server error'));
  };
