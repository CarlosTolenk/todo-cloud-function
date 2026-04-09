import { describe, expect, it } from 'vitest';

import { FirestoreTaskRepository } from '../../src/modules/tasks/infrastructure/firestore-task-repository';
import { FakeFirestore } from '../support/fake-firestore';

describe('FirestoreTaskRepository', () => {
  it('creates a task', async () => {
    const repository = new FirestoreTaskRepository(new FakeFirestore() as never);

    const task = await repository.create({
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
    });

    expect(task).toMatchObject({
      id: expect.any(String),
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('finds a task by id', async () => {
    const firestore = new FakeFirestore();
    firestore.seed('tasks', 'task-1', {
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    const repository = new FirestoreTaskRepository(firestore as never);

    const task = await repository.findById('task-1');

    expect(task).toEqual({
      id: 'task-1',
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('returns null when the task is not found', async () => {
    const repository = new FirestoreTaskRepository(new FakeFirestore() as never);

    await expect(repository.findById('missing-task')).resolves.toBeNull();
  });

  it('finds tasks by user ordered by createdAt desc', async () => {
    const firestore = new FakeFirestore();
    firestore.seed('tasks', 'task-1', {
      userId: 'user-1',
      title: 'Older task',
      description: 'Description 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    firestore.seed('tasks', 'task-2', {
      userId: 'user-1',
      title: 'Newer task',
      description: 'Description 2',
      completed: false,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    });
    firestore.seed('tasks', 'task-3', {
      userId: 'user-2',
      title: 'Other user task',
      description: 'Description 3',
      completed: false,
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    });
    const repository = new FirestoreTaskRepository(firestore as never);

    const tasks = await repository.findByUserId('user-1');

    expect(tasks.map((task) => task.id)).toEqual(['task-2', 'task-1']);
  });

  it('updates an existing task', async () => {
    const firestore = new FakeFirestore();
    firestore.seed('tasks', 'task-1', {
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    const repository = new FirestoreTaskRepository(firestore as never);

    const updatedTask = await repository.update('task-1', {
      completed: true,
      title: 'Updated title',
    });

    expect(updatedTask).toMatchObject({
      id: 'task-1',
      userId: 'user-1',
      title: 'Updated title',
      description: 'Task description',
      completed: true,
    });
    expect(updatedTask.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');
  });

  it('throws when updating a task that does not exist', async () => {
    const repository = new FirestoreTaskRepository(new FakeFirestore() as never);

    await expect(
      repository.update('missing-task', { completed: true }),
    ).rejects.toThrow('Task must exist before updating');
  });

  it('deletes an existing task', async () => {
    const firestore = new FakeFirestore();
    firestore.seed('tasks', 'task-1', {
      userId: 'user-1',
      title: 'Task title',
      description: 'Task description',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    const repository = new FirestoreTaskRepository(firestore as never);

    await repository.delete('task-1');

    await expect(repository.findById('task-1')).resolves.toBeNull();
  });
});
