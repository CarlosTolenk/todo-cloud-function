import { CreateTaskUseCase } from '../modules/tasks/application/create-task';
import { DeleteTaskUseCase } from '../modules/tasks/application/delete-task';
import { GetTasksByUserUseCase } from '../modules/tasks/application/get-tasks-by-user';
import { UpdateTaskUseCase } from '../modules/tasks/application/update-task';
import { TasksController } from '../modules/tasks/presentation/tasks.controller';
import { CreateUserUseCase } from '../modules/users/application/create-user';
import { FindUserByEmailUseCase } from '../modules/users/application/find-user-by-email';
import { UsersController } from '../modules/users/presentation/users.controller';
import type { AppDependencies } from './app-dependencies';

export class AppContainer {
  private usersControllerInstance?: UsersController;
  private tasksControllerInstance?: TasksController;

  constructor(private readonly dependencies: AppDependencies) {}

  get corsOrigin(): string {
    return this.dependencies.corsOrigin;
  }

  get usersController(): UsersController {
    if (!this.usersControllerInstance) {
      this.usersControllerInstance = new UsersController(
        new FindUserByEmailUseCase(this.dependencies.userRepository),
        new CreateUserUseCase(this.dependencies.userRepository),
      );
    }

    return this.usersControllerInstance;
  }

  get tasksController(): TasksController {
    if (!this.tasksControllerInstance) {
      this.tasksControllerInstance = new TasksController(
        new GetTasksByUserUseCase(
          this.dependencies.taskRepository,
          this.dependencies.userRepository,
        ),
        new CreateTaskUseCase(
          this.dependencies.taskRepository,
          this.dependencies.userRepository,
        ),
        new UpdateTaskUseCase(this.dependencies.taskRepository),
        new DeleteTaskUseCase(this.dependencies.taskRepository),
      );
    }

    return this.tasksControllerInstance;
  }
}

export const createAppContainer = (
  dependencies: AppDependencies,
): AppContainer => new AppContainer(dependencies);
