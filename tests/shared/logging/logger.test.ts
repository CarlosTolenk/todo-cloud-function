import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConsoleLogger } from '../../../src/shared/logging/logger';

describe('ConsoleLogger', () => {
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('writes info logs as structured json', () => {
    const logger = new ConsoleLogger('info', 'test-service');

    logger.info('Test message', { requestId: 'req-1' });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(consoleLogSpy.mock.calls[0]![0] as string)).toMatchObject({
      level: 'info',
      service: 'test-service',
      message: 'Test message',
      context: {
        requestId: 'req-1',
      },
    });
  });

  it('filters logs below the configured level', () => {
    const logger = new ConsoleLogger('warn');

    logger.info('Ignored');

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('serializes errors in the log context', () => {
    const logger = new ConsoleLogger('error');
    const error = new Error('boom');

    logger.error('Unhandled error', { error });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0]![0] as string)).toMatchObject({
      level: 'error',
      message: 'Unhandled error',
      context: {
        error: {
          name: 'Error',
          message: 'boom',
        },
      },
    });
  });

  it('writes debug logs and serializes nested arrays', () => {
    const logger = new ConsoleLogger('debug');

    logger.debug('Debug message', {
      items: [new Error('nested'), { status: 'ok' }],
    });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(consoleLogSpy.mock.calls[0]![0] as string)).toMatchObject({
      level: 'debug',
      message: 'Debug message',
      context: {
        items: [
          {
            name: 'Error',
            message: 'nested',
          },
          {
            status: 'ok',
          },
        ],
      },
    });
  });

  it('writes warn logs to console.warn', () => {
    const logger = new ConsoleLogger('warn');

    logger.warn('Warning message');

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });
});
