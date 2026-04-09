import { describe, expect, it } from 'vitest';

import { FirestoreUserRepository } from '../../src/modules/users/infrastructure/firestore-user-repository';
import { FakeFirestore } from '../support/fake-firestore';

describe('FirestoreUserRepository', () => {
  it('creates a user', async () => {
    const repository = new FirestoreUserRepository(new FakeFirestore() as never);

    const user = await repository.create({
      email: 'test@example.com',
    });

    expect(user).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      createdAt: expect.any(String),
    });
  });

  it('finds a user by email', async () => {
    const firestore = new FakeFirestore();
    firestore.seed('users', 'user-1', {
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
    const repository = new FirestoreUserRepository(firestore as never);

    const user = await repository.findByEmail('test@example.com');

    expect(user).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('returns null when the user is not found by email', async () => {
    const repository = new FirestoreUserRepository(new FakeFirestore() as never);

    await expect(repository.findByEmail('missing@example.com')).resolves.toBeNull();
  });

  it('finds a user by id', async () => {
    const firestore = new FakeFirestore();
    firestore.seed('users', 'user-1', {
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
    const repository = new FirestoreUserRepository(firestore as never);

    const user = await repository.findById('user-1');

    expect(user).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('returns null when the user is not found by id', async () => {
    const repository = new FirestoreUserRepository(new FakeFirestore() as never);

    await expect(repository.findById('missing-user')).resolves.toBeNull();
  });
});
