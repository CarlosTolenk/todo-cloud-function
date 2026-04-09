import { describe, expect, it } from 'vitest';

import { SystemClock } from '../../../src/shared/types/clock';

describe('SystemClock', () => {
  it('returns a valid ISO string', () => {
    const value = new SystemClock().now();

    expect(value).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(value))).toBe(false);
  });
});
