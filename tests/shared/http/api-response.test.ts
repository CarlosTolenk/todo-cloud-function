import { describe, expect, it } from 'vitest';

import {
  errorResponse,
  successResponse,
} from '../../../src/shared/http/api-response';

describe('api responses', () => {
  it('builds a success payload', () => {
    expect(successResponse({ id: '123' })).toEqual({
      success: true,
      data: { id: '123' },
    });
  });

  it('builds an error payload with details', () => {
    expect(errorResponse('TEST_ERROR', 'Something failed', { field: 'email' })).toEqual({
      success: false,
      error: {
        code: 'TEST_ERROR',
        message: 'Something failed',
        details: { field: 'email' },
      },
    });
  });

  it('builds an error payload without details', () => {
    expect(errorResponse('TEST_ERROR', 'Something failed')).toEqual({
      success: false,
      error: {
        code: 'TEST_ERROR',
        message: 'Something failed',
      },
    });
  });
});
