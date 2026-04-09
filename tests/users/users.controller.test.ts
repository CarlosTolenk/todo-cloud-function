import { describe, expect, it, vi } from 'vitest';

import { UsersController } from '../../src/modules/users/presentation/users.controller';
import { createMockResponse, flushPromises } from '../support/http-test-helpers';

describe('UsersController', () => {
  it('returns a user by email', async () => {
    const findUserByEmailUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
      }),
    };
    const createUserUseCase = {
      execute: vi.fn(),
    };
    const controller = new UsersController(
      findUserByEmailUseCase as never,
      createUserUseCase as never,
    );
    const response = createMockResponse();
    const next = vi.fn();

    controller.getByEmail(
      { params: { email: 'TEST@example.com' } } as never,
      response as never,
      next,
    );
    await flushPromises();

    expect(findUserByEmailUseCase.execute).toHaveBeenCalledWith('test@example.com');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 'user-1',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    });
  });

  it('creates a user', async () => {
    const findUserByEmailUseCase = {
      execute: vi.fn(),
    };
    const createUserUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
      }),
    };
    const controller = new UsersController(
      findUserByEmailUseCase as never,
      createUserUseCase as never,
    );
    const response = createMockResponse();
    const next = vi.fn();

    controller.create(
      { body: { email: 'TEST@example.com' } } as never,
      response as never,
      next,
    );
    await flushPromises();

    expect(createUserUseCase.execute).toHaveBeenCalledWith('test@example.com');
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 'user-1',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    });
  });
});
