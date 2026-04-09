import { describe, expect, it } from 'vitest';

import { CreateUserUseCase } from '../../src/modules/users/application/create-user';
import { AppError } from '../../src/shared/errors/app-error';
import { InMemoryUserRepository } from '../support/in-memory-user-repository';

describe('CreateUserUseCase', () => {
  it('creates a user when the email does not exist', async () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(userRepository);

    const user = await useCase.execute('test@example.com');

    expect(user).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      createdAt: expect.any(String),
    });
  });

  it('rejects duplicated emails', async () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(userRepository);

    await useCase.execute('duplicate@example.com');

    await expect(useCase.execute('duplicate@example.com')).rejects.toMatchObject({
      code: 'USER_ALREADY_EXISTS',
      message: 'A user with this email already exists',
      statusCode: 409,
    } satisfies Partial<AppError>);
  });
});
