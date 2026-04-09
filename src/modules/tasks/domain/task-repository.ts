import type { CreateTaskInput, Task, UpdateTaskInput } from './task';

export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
}
