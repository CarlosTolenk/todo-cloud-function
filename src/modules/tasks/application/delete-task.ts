import { AppError } from '../../../shared/errors/app-error';
import { HTTP_STATUS } from '../../../shared/http/http-status';
import type { TaskRepository } from '../domain/task-repository';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 'Task not found', HTTP_STATUS.NOT_FOUND);
    }

    await this.taskRepository.delete(id);
  }
}
