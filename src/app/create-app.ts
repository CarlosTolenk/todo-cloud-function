import cors from 'cors';
import express from 'express';

import { CreateTaskUseCase } from '../modules/tasks/application/create-task';
import { DeleteTaskUseCase } from '../modules/tasks/application/delete-task';
import { GetTasksByUserUseCase } from '../modules/tasks/application/get-tasks-by-user';
import { UpdateTaskUseCase } from '../modules/tasks/application/update-task';
import { TasksController } from '../modules/tasks/presentation/tasks.controller';
import { buildTasksRouter } from '../modules/tasks/presentation/tasks.routes';
import { CreateUserUseCase } from '../modules/users/application/create-user';
import { FindUserByEmailUseCase } from '../modules/users/application/find-user-by-email';
import { UsersController } from '../modules/users/presentation/users.controller';
import { buildUsersRouter } from '../modules/users/presentation/users.routes';
import { errorHandler, notFoundHandler } from '../shared/http/error-middleware';
import { successResponse } from '../shared/http/api-response';
import { HTTP_STATUS } from '../shared/http/http-status';
import type { AppDependencies } from './app-dependencies';

export const createApp = (dependencies: AppDependencies) => {
  const app = express();

  const usersController = new UsersController(
    new FindUserByEmailUseCase(dependencies.userRepository),
    new CreateUserUseCase(dependencies.userRepository),
  );

  const tasksController = new TasksController(
    new GetTasksByUserUseCase(
      dependencies.taskRepository,
      dependencies.userRepository,
    ),
    new CreateTaskUseCase(dependencies.taskRepository, dependencies.userRepository),
    new UpdateTaskUseCase(dependencies.taskRepository),
    new DeleteTaskUseCase(dependencies.taskRepository),
  );

  app.use(
    cors({
      origin: dependencies.corsOrigin,
    }),
  );
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.status(HTTP_STATUS.OK).json(successResponse({ status: 'ok' }));
  });

  app.use('/users', buildUsersRouter(usersController));
  app.use('/tasks', buildTasksRouter(tasksController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
