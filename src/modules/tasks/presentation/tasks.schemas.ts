import { z } from 'zod';

import { idSchema } from '../../../shared/validation/common-schemas';

export const getTasksQuerySchema = z.object({
  userId: idSchema,
});

export const createTaskBodySchema = z.object({
  userId: idSchema,
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
});

export const updateTaskParamsSchema = z.object({
  id: idSchema,
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().min(1).max(500).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.completed !== undefined,
    {
      message: 'At least one field must be provided',
    },
  );
