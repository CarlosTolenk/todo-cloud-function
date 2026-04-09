import type { TaskRepository } from '../modules/tasks/domain/task-repository';
import type { UserRepository } from '../modules/users/domain/user-repository';

export interface AppDependencies {
  userRepository: UserRepository;
  taskRepository: TaskRepository;
  corsOrigin: string;
}
