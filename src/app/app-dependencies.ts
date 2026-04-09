import type { TaskRepository } from '../modules/tasks/domain/task-repository';
import type { UserRepository } from '../modules/users/domain/user-repository';
import type { Logger } from '../shared/logging/logger';

export interface AppDependencies {
  userRepository: UserRepository;
  taskRepository: TaskRepository;
  corsOrigin: string;
  logger: Logger;
}
