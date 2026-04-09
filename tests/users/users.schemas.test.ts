import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import {
  createUserBodySchema,
  getUserByEmailParamsSchema,
} from '../../src/modules/users/presentation/users.schemas';

describe('users schemas', () => {
  it('normalizes a valid email in the request body', () => {
    const result = createUserBodySchema.parse({
      email: '  USER@Example.COM ',
    });

    expect(result).toEqual({
      email: 'user@example.com',
    });
  });

  it('normalizes a valid email in route params', () => {
    const result = getUserByEmailParamsSchema.parse({
      email: '  USER@Example.COM ',
    });

    expect(result).toEqual({
      email: 'user@example.com',
    });
  });

  it('rejects an invalid email', () => {
    expect(() => createUserBodySchema.parse({ email: 'invalid-email' })).toThrow(
      ZodError,
    );
  });
});
