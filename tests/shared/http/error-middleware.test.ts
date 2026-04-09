import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { AppError } from '../../../src/shared/errors/app-error';
import {
  errorHandler,
  notFoundHandler,
} from '../../../src/shared/http/error-middleware';
import { createMockResponse } from '../../support/http-test-helpers';

describe('error middleware', () => {
  it('returns a not found response', () => {
    const response = createMockResponse();

    notFoundHandler({} as never, response as never);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  it('maps zod errors to a 400 response', () => {
    const response = createMockResponse();
    const next = vi.fn();
    let validationError: unknown;

    try {
      z.object({ email: z.string().email() }).parse({ email: 'invalid' });
    } catch (error) {
      validationError = error;
    }

    errorHandler(validationError, {} as never, response as never, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
        }),
      }),
    );
  });

  it('maps app errors to their explicit status code', () => {
    const response = createMockResponse();
    const next = vi.fn();

    errorHandler(
      new AppError('TEST_ERROR', 'Known error', 409, { field: 'email' }),
      {} as never,
      response as never,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'TEST_ERROR',
        message: 'Known error',
        details: { field: 'email' },
      },
    });
  });

  it('maps unknown errors to a 500 response', () => {
    const response = createMockResponse();
    const next = vi.fn();

    errorHandler(new Error('unknown'), {} as never, response as never, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error',
      },
    });
  });
});
