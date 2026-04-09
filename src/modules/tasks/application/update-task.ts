import { AppError } from '../../../shared/errors/app-error';
import { HTTP_STATUS } from '../../../shared/http/http-status';
import type { Task, UpdateTaskInput } from '../domain/task';
import type { TaskRepository } from '../domain/task-repository';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, input: UpdateTaskInput): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 'Task not found', HTTP_STATUS.NOT_FOUND);
    }

    return this.taskRepository.update(id, input);
  }
}
