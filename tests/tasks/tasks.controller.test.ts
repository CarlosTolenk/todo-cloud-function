import { describe, expect, it, vi } from 'vitest';

import { TasksController } from '../../src/modules/tasks/presentation/tasks.controller';
import { createMockResponse, flushPromises } from '../support/http-test-helpers';

describe('TasksController', () => {
  it('returns tasks by user', async () => {
    const controller = new TasksController(
      {
        execute: vi.fn().mockResolvedValue([
          {
            id: 'task-1',
            userId: 'user-1',
            title: 'Task',
            description: 'Description',
            completed: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ]),
      } as never,
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
    );
    const response = createMockResponse();

    controller.getByUser(
      { query: { userId: 'user-1' } } as never,
      response as never,
      vi.fn(),
    );
    await flushPromises();

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'task-1',
          }),
        ]),
      }),
    );
  });

  it('creates a task', async () => {
    const createTaskUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'task-1',
        userId: 'user-1',
        title: 'Task',
        description: 'Description',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }),
    };
    const controller = new TasksController(
      { execute: vi.fn() } as never,
      createTaskUseCase as never,
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
    );
    const response = createMockResponse();

    controller.create(
      {
        body: {
          userId: 'user-1',
          title: 'Task',
          description: 'Description',
        },
      } as never,
      response as never,
      vi.fn(),
    );
    await flushPromises();

    expect(createTaskUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-1',
      title: 'Task',
      description: 'Description',
    });
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it('updates a task', async () => {
    const updateTaskUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'task-1',
        userId: 'user-1',
        title: 'Updated task',
        description: 'Description',
        completed: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      }),
    };
    const controller = new TasksController(
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
      updateTaskUseCase as never,
      { execute: vi.fn() } as never,
    );
    const response = createMockResponse();

    controller.update(
      {
        params: { id: 'task-1' },
        body: { completed: true, title: 'Updated task' },
      } as never,
      response as never,
      vi.fn(),
    );
    await flushPromises();

    expect(updateTaskUseCase.execute).toHaveBeenCalledWith('task-1', {
      completed: true,
      title: 'Updated task',
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('deletes a task', async () => {
    const deleteTaskUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
    const controller = new TasksController(
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
      deleteTaskUseCase as never,
    );
    const response = createMockResponse();

    controller.delete(
      { params: { id: 'task-1' } } as never,
      response as never,
      vi.fn(),
    );
    await flushPromises();

    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith('task-1');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 'task-1',
      },
    });
  });
});
