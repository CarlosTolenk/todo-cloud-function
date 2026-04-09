import { describe, expect, it, vi } from 'vitest';

import { asyncHandler } from '../../../src/shared/http/async-handler';
import { flushPromises } from '../../support/http-test-helpers';

describe('asyncHandler', () => {
  it('executes the wrapped handler', async () => {
    const handler = vi.fn(async () => undefined);
    const next = vi.fn();
    const wrappedHandler = asyncHandler(handler);

    wrappedHandler({} as never, {} as never, next);
    await flushPromises();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards async errors to next', async () => {
    const error = new Error('boom');
    const next = vi.fn();
    const wrappedHandler = asyncHandler(async () => {
      throw error;
    });

    wrappedHandler({} as never, {} as never, next);
    await flushPromises();

    expect(next).toHaveBeenCalledWith(error);
  });
});
