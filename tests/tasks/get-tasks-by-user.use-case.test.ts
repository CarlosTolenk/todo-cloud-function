import { describe, expect, it } from 'vitest';

import { GetTasksByUserUseCase } from '../../src/modules/tasks/application/get-tasks-by-user';
import { AppError } from '../../src/shared/errors/app-error';
import { InMemoryTaskRepository } from '../support/in-memory-task-repository';
import { InMemoryUserRepository } from '../support/in-memory-user-repository';

describe('GetTasksByUserUseCase', () => {
  it('returns the tasks for an existing user', async () => {
    const userRepository = new InMemoryUserRepository();
    const taskRepository = new InMemoryTaskRepository();
    const user = await userRepository.create({ email: 'tasks@example.com' });
    await taskRepository.create({
      userId: user.id,
      title: 'Task 1',
      description: 'Description 1',
    });
    await taskRepository.create({
      userId: user.id,
      title: 'Task 2',
      description: 'Description 2',
    });
    const useCase = new GetTasksByUserUseCase(taskRepository, userRepository);

    const tasks = await useCase.execute(user.id);

    expect(tasks).toHaveLength(2);
    expect(tasks.map((task) => task.title)).toEqual(['Task 1', 'Task 2']);
  });

  it('rejects the query when the user does not exist', async () => {
    const useCase = new GetTasksByUserUseCase(
      new InMemoryTaskRepository(),
      new InMemoryUserRepository(),
    );

    await expect(useCase.execute('missing-user')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      message: 'User not found',
      statusCode: 404,
    } satisfies Partial<AppError>);
  });
});
