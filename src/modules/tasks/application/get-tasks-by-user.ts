import { AppError } from '../../../shared/errors/app-error';
import { HTTP_STATUS } from '../../../shared/http/http-status';
import type { UserRepository } from '../../users/domain/user-repository';
import type { Task } from '../domain/task';
import type { TaskRepository } from '../domain/task-repository';

export class GetTasksByUserUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<Task[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    return this.taskRepository.findByUserId(userId);
  }
}
