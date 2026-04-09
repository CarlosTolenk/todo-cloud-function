import { z } from 'zod';

import { emailSchema } from '../../../shared/validation/common-schemas';

export const getUserByEmailParamsSchema = z.object({
  email: emailSchema,
});

export const createUserBodySchema = z.object({
  email: emailSchema,
});
