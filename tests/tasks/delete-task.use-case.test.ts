import { describe, expect, it } from 'vitest';

import { DeleteTaskUseCase } from '../../src/modules/tasks/application/delete-task';
import { AppError } from '../../src/shared/errors/app-error';
import { InMemoryTaskRepository } from '../support/in-memory-task-repository';

describe('DeleteTaskUseCase', () => {
  it('deletes an existing task', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const task = await taskRepository.create({
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
    });
    const useCase = new DeleteTaskUseCase(taskRepository);

    await useCase.execute(task.id);

    await expect(taskRepository.findById(task.id)).resolves.toBeNull();
  });

  it('rejects the deletion when the task does not exist', async () => {
    const useCase = new DeleteTaskUseCase(new InMemoryTaskRepository());

    await expect(useCase.execute('missing-task')).rejects.toMatchObject({
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
      statusCode: 404,
    } satisfies Partial<AppError>);
  });
});
