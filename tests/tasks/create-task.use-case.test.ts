import { describe, expect, it } from 'vitest';

import { CreateTaskUseCase } from '../../src/modules/tasks/application/create-task';
import { UserNotFoundError } from '../../src/modules/users/domain/user-errors';
import { InMemoryTaskRepository } from '../support/in-memory-task-repository';
import { InMemoryUserRepository } from '../support/in-memory-user-repository';

describe('CreateTaskUseCase', () => {
  it('creates a task for an existing user', async () => {
    const userRepository = new InMemoryUserRepository();
    const taskRepository = new InMemoryTaskRepository();
    const user = await userRepository.create({ email: 'tasks@example.com' });
    const useCase = new CreateTaskUseCase(taskRepository, userRepository);

    const task = await useCase.execute({
      userId: user.id,
      title: 'Finish backend',
      description: 'Implement API with Express and Firestore',
    });

    expect(task).toMatchObject({
      id: expect.any(String),
      userId: user.id,
      title: 'Finish backend',
      description: 'Implement API with Express and Firestore',
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('rejects the creation when the user does not exist', async () => {
    const useCase = new CreateTaskUseCase(
      new InMemoryTaskRepository(),
      new InMemoryUserRepository(),
    );

    await expect(
      useCase.execute({
        userId: 'missing-user',
        title: 'Orphan task',
        description: 'Should fail',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
    await expect(
      useCase.execute({
        userId: 'missing-user',
        title: 'Orphan task',
        description: 'Should fail',
      }),
    ).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      details: {
        userId: 'missing-user',
      },
    });
  });
});
