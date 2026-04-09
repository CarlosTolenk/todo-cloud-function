import type { Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export const getRequestId = (response: Response): string | undefined =>
  response.locals.requestId as string | undefined;

export const buildRequestLogContext = (
  request: Request,
  response: Response,
): Record<string, unknown> => ({
  requestId: getRequestId(response),
  method: request.method,
  path: request.originalUrl,
  statusCode: response.statusCode,
});
