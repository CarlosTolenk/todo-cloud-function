import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import {
  createTaskBodySchema,
  getTasksQuerySchema,
  updateTaskBodySchema,
  updateTaskParamsSchema,
} from '../../src/modules/tasks/presentation/tasks.schemas';

describe('tasks schemas', () => {
  it('accepts a valid create task payload', () => {
    const result = createTaskBodySchema.parse({
      userId: 'user-1',
      title: 'Finish backend',
      description: 'Implement business logic',
    });

    expect(result).toEqual({
      userId: 'user-1',
      title: 'Finish backend',
      description: 'Implement business logic',
    });
  });

  it('accepts a valid userId query', () => {
    const result = getTasksQuerySchema.parse({
      userId: 'user-1',
    });

    expect(result).toEqual({
      userId: 'user-1',
    });
  });

  it('accepts valid update params', () => {
    const result = updateTaskParamsSchema.parse({
      id: 'task-1',
    });

    expect(result).toEqual({
      id: 'task-1',
    });
  });

  it('rejects an empty update body', () => {
    expect(() => updateTaskBodySchema.parse({})).toThrow(ZodError);
  });

  it('rejects invalid create payloads', () => {
    expect(() =>
      createTaskBodySchema.parse({
        userId: '',
        title: '',
        description: '',
      }),
    ).toThrow(ZodError);
  });
});
