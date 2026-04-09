import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../../src/modules/tasks/domain/task';
import type { TaskRepository } from '../../src/modules/tasks/domain/task-repository';

export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks = new Map<string, Task>();

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return [...this.tasks.values()]
      .filter((task) => task.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: `task-${this.tasks.size + 1}`,
      userId: input.userId,
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);

    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const currentTask = this.tasks.get(id);

    if (!currentTask) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...currentTask,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);

    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id);
  }
}
