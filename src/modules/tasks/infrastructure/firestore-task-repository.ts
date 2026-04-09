import type { Firestore } from 'firebase-admin/firestore';

import type { CreateTaskInput, Task, UpdateTaskInput } from '../domain/task';
import type { TaskRepository } from '../domain/task-repository';

interface TaskDocument {
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const TASKS_COLLECTION = 'tasks';

export class FirestoreTaskRepository implements TaskRepository {
  constructor(private readonly firestore: Firestore) {}

  async findById(id: string): Promise<Task | null> {
    const document = await this.firestore.collection(TASKS_COLLECTION).doc(id).get();

    if (!document.exists) {
      return null;
    }

    return {
      id: document.id,
      ...(document.data() as TaskDocument),
    };
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.firestore
      .collection(TASKS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as TaskDocument),
    }));
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const reference = this.firestore.collection(TASKS_COLLECTION).doc();
    const now = new Date().toISOString();
    const task: Task = {
      id: reference.id,
      userId: input.userId,
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    await reference.set({
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });

    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const reference = this.firestore.collection(TASKS_COLLECTION).doc(id);
    const currentTask = await this.findById(id);

    if (!currentTask) {
      throw new Error('Task must exist before updating');
    }

    const updatedTask: Task = {
      ...currentTask,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await reference.update({
      ...input,
      updatedAt: updatedTask.updatedAt,
    });

    return updatedTask;
  }

  delete(id: string): Promise<void> {
    return this.firestore.collection(TASKS_COLLECTION).doc(id).delete().then(() => undefined);
  }
}
