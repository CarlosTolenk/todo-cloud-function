import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import { CreateTaskUseCase } from '../src/modules/tasks/application/create-task';
import { DeleteTaskUseCase } from '../src/modules/tasks/application/delete-task';
import { GetTasksByUserUseCase } from '../src/modules/tasks/application/get-tasks-by-user';
import { UpdateTaskUseCase } from '../src/modules/tasks/application/update-task';
import { updateTaskBodySchema } from '../src/modules/tasks/presentation/tasks.schemas';
import { CreateUserUseCase } from '../src/modules/users/application/create-user';
import { FindUserByEmailUseCase } from '../src/modules/users/application/find-user-by-email';
import { createUserBodySchema } from '../src/modules/users/presentation/users.schemas';
import { AppError } from '../src/shared/errors/app-error';
import { InMemoryTaskRepository } from './support/in-memory-task-repository';
import { InMemoryUserRepository } from './support/in-memory-user-repository';

describe('Users module', () => {
  it('creates a user and retrieves it by email', async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);

    const user = await createUserUseCase.execute('test@example.com');
    const foundUser = await findUserByEmailUseCase.execute('test@example.com');

    expect(user.email).toBe('test@example.com');
    expect(foundUser).toEqual(user);
  });

  it('rejects duplicate users with a clear domain error', async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    await createUserUseCase.execute('duplicate@example.com');

    await expect(
      createUserUseCase.execute('duplicate@example.com'),
    ).rejects.toMatchObject({
      code: 'USER_ALREADY_EXISTS',
      statusCode: 409,
    } satisfies Partial<AppError>);
  });

  it('validates user payloads with explicit schemas', () => {
    expect(() => createUserBodySchema.parse({ email: 'invalid-email' })).toThrow(
      ZodError,
    );
  });
});

describe('Tasks module', () => {
  it('creates, lists, updates and deletes tasks for an existing user', async () => {
    const userRepository = new InMemoryUserRepository();
    const taskRepository = new InMemoryTaskRepository();

    const createUserUseCase = new CreateUserUseCase(userRepository);
    const getTasksByUserUseCase = new GetTasksByUserUseCase(
      taskRepository,
      userRepository,
    );
    const createTaskUseCase = new CreateTaskUseCase(taskRepository, userRepository);
    const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

    const user = await createUserUseCase.execute('tasks@example.com');

    const createdTask = await createTaskUseCase.execute({
      userId: user.id,
      title: 'Finish backend',
      description: 'Implement API with Express and Firestore',
    });

    const tasks = await getTasksByUserUseCase.execute(user.id);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      id: createdTask.id,
      completed: false,
    });

    const updatedTask = await updateTaskUseCase.execute(createdTask.id, {
      completed: true,
    });
    expect(updatedTask.completed).toBe(true);

    await deleteTaskUseCase.execute(createdTask.id);

    const tasksAfterDelete = await getTasksByUserUseCase.execute(user.id);
    expect(tasksAfterDelete).toEqual([]);
  });

  it('rejects task creation when the user does not exist', async () => {
    const createTaskUseCase = new CreateTaskUseCase(
      new InMemoryTaskRepository(),
      new InMemoryUserRepository(),
    );

    await expect(
      createTaskUseCase.execute({
        userId: 'missing-user',
        title: 'Orphan task',
        description: 'Should fail',
      }),
    ).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      statusCode: 404,
    } satisfies Partial<AppError>);
  });

  it('validates partial task updates', () => {
    expect(() => updateTaskBodySchema.parse({})).toThrow(ZodError);
  });
});
