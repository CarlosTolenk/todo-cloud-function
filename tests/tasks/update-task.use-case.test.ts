import { describe, expect, it } from 'vitest';

import { UpdateTaskUseCase } from '../../src/modules/tasks/application/update-task';
import { AppError } from '../../src/shared/errors/app-error';
import { InMemoryTaskRepository } from '../support/in-memory-task-repository';

describe('UpdateTaskUseCase', () => {
  it('updates an existing task', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const task = await taskRepository.create({
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
    });
    const useCase = new UpdateTaskUseCase(taskRepository);

    const updatedTask = await useCase.execute(task.id, {
      title: 'Updated title',
      completed: true,
    });

    expect(updatedTask).toMatchObject({
      id: task.id,
      title: 'Updated title',
      description: 'Task description',
      completed: true,
    });
    expect(updatedTask.updatedAt >= task.updatedAt).toBe(true);
  });

  it('rejects the update when the task does not exist', async () => {
    const useCase = new UpdateTaskUseCase(new InMemoryTaskRepository());

    await expect(
      useCase.execute('missing-task', { completed: true }),
    ).rejects.toMatchObject({
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
      statusCode: 404,
    } satisfies Partial<AppError>);
  });
});
