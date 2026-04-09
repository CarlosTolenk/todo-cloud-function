import { EventEmitter } from 'node:events';

import { describe, expect, it, vi } from 'vitest';

import {
  REQUEST_ID_HEADER,
} from '../../../src/shared/http/request-context';
import { createRequestLogger } from '../../../src/shared/http/request-logger';

class MockResponse extends EventEmitter {
  statusCode = 200;
  locals: Record<string, unknown> = {};
  readonly setHeader = vi.fn();
}

describe('request logger middleware', () => {
  it('logs request start and completion with an existing request id', () => {
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const middleware = createRequestLogger(logger);
    const response = new MockResponse();
    const next = vi.fn();

    middleware(
      {
        method: 'GET',
        originalUrl: '/tasks?userId=user-1',
        header: (name: string) =>
          name.toLowerCase() === REQUEST_ID_HEADER ? 'req-123' : undefined,
      } as never,
      response as never,
      next,
    );

    response.emit('finish');

    expect(next).toHaveBeenCalledTimes(1);
    expect(response.setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, 'req-123');
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      'Request started',
      expect.objectContaining({
        requestId: 'req-123',
        method: 'GET',
        path: '/tasks?userId=user-1',
      }),
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      'Request completed',
      expect.objectContaining({
        requestId: 'req-123',
        statusCode: 200,
        durationMs: expect.any(Number),
      }),
    );
  });

  it('logs client errors as warnings', () => {
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const middleware = createRequestLogger(logger);
    const response = new MockResponse();
    response.statusCode = 404;

    middleware(
      {
        method: 'GET',
        originalUrl: '/missing',
        header: () => undefined,
      } as never,
      response as never,
      vi.fn(),
    );

    response.emit('finish');

    expect(logger.warn).toHaveBeenCalledWith(
      'Request completed with client error',
      expect.objectContaining({
        statusCode: 404,
      }),
    );
  });

  it('logs server errors as errors', () => {
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const middleware = createRequestLogger(logger);
    const response = new MockResponse();
    response.statusCode = 500;

    middleware(
      {
        method: 'POST',
        originalUrl: '/tasks',
        header: () => undefined,
      } as never,
      response as never,
      vi.fn(),
    );

    response.emit('finish');

    expect(logger.error).toHaveBeenCalledWith(
      'Request failed',
      expect.objectContaining({
        statusCode: 500,
      }),
    );
  });
});
