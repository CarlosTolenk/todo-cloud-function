import type { UserRepository } from '../../users/domain/user-repository';
import { UserNotFoundError } from '../../users/domain/user-errors';
import type { Task } from '../domain/task';
import type { TaskRepository } from '../domain/task-repository';

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: {
    userId: string;
    title: string;
    description: string;
  }): Promise<Task> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    return this.taskRepository.create(input);
  }
}
