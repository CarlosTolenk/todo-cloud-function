import type { UserRepository } from '../../users/domain/user-repository';
import { UserNotFoundError } from '../../users/domain/user-errors';
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
      throw new UserNotFoundError(userId);
    }

    return this.taskRepository.findByUserId(userId);
  }
}
