import { TaskNotFoundError } from '../domain/task-errors';
import type { TaskRepository } from '../domain/task-repository';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    await this.taskRepository.delete(id);
  }
}
