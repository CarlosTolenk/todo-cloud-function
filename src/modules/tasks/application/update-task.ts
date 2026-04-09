import type { Task, UpdateTaskInput } from '../domain/task';
import { TaskNotFoundError } from '../domain/task-errors';
import type { TaskRepository } from '../domain/task-repository';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, input: UpdateTaskInput): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    return this.taskRepository.update(id, input);
  }
}
