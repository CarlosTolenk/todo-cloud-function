import { randomUUID } from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

import type { Logger } from '../logging/logger';
import { REQUEST_ID_HEADER, buildRequestLogContext } from './request-context';

export const createRequestLogger = (logger: Logger) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const startedAt = process.hrtime.bigint();
    const requestId =
      request.header(REQUEST_ID_HEADER) ?? request.header(REQUEST_ID_HEADER.toUpperCase()) ?? randomUUID();

    response.locals.requestId = requestId;
    response.setHeader(REQUEST_ID_HEADER, requestId);

    logger.info('Request started', buildRequestLogContext(request, response));

    response.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const context = {
        ...buildRequestLogContext(request, response),
        durationMs: Number(durationMs.toFixed(2)),
      };

      if (response.statusCode >= 500) {
        logger.error('Request failed', context);
        return;
      }

      if (response.statusCode >= 400) {
        logger.warn('Request completed with client error', context);
        return;
      }

      logger.info('Request completed', context);
    });

    next();
  };
};
