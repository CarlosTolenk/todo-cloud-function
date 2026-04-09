import cors from 'cors';
import express from 'express';

import { buildTasksRouter } from '../modules/tasks/presentation/tasks.routes';
import { buildUsersRouter } from '../modules/users/presentation/users.routes';
import { errorHandler, notFoundHandler } from '../shared/http/error-middleware';
import { successResponse } from '../shared/http/api-response';
import { HTTP_STATUS } from '../shared/http/http-status';
import type { AppContainer } from './app-container';

export const createApp = (container: AppContainer) => {
  const app = express();

  app.use(
    cors({
      origin: container.corsOrigin,
    }),
  );
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.status(HTTP_STATUS.OK).json(successResponse({ status: 'ok' }));
  });

  app.use('/users', buildUsersRouter(container.usersController));
  app.use('/tasks', buildTasksRouter(container.tasksController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
