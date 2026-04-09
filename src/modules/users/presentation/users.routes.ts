import { Router } from 'express';

import type { UsersController } from './users.controller';

export const buildUsersRouter = (usersController: UsersController): Router => {
  const router = Router();

  router.get('/by-email/:email', usersController.getByEmail);
  router.post('/', usersController.create);

  return router;
};
