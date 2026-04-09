import { describe, expect, it } from 'vitest';

import { FindUserByEmailUseCase } from '../../src/modules/users/application/find-user-by-email';
import { InMemoryUserRepository } from '../support/in-memory-user-repository';

describe('FindUserByEmailUseCase', () => {
  it('returns the user when the email exists', async () => {
    const userRepository = new InMemoryUserRepository();
    const existingUser = await userRepository.create({
      email: 'existing@example.com',
    });
    const useCase = new FindUserByEmailUseCase(userRepository);

    const result = await useCase.execute('existing@example.com');

    expect(result).toEqual(existingUser);
  });

  it('returns null when the email does not exist', async () => {
    const useCase = new FindUserByEmailUseCase(new InMemoryUserRepository());

    const result = await useCase.execute('missing@example.com');

    expect(result).toBeNull();
  });
});
