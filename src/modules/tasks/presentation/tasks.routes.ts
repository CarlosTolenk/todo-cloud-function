import { Router } from 'express';

import type { TasksController } from './tasks.controller';

export const buildTasksRouter = (tasksController: TasksController): Router => {
  const router = Router();

  router.get('/', tasksController.getByUser);
  router.post('/', tasksController.create);
  router.patch('/:id', tasksController.update);
  router.delete('/:id', tasksController.delete);

  return router;
};
