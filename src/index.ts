import { onRequest } from 'firebase-functions/v2/https';

import { createAppContainer } from './app/app-container';
import { createApp } from './app/create-app';
import { env } from './config/env';
import { firestore } from './config/firebase';
import { FirestoreTaskRepository } from './modules/tasks/infrastructure/firestore-task-repository';
import { FirestoreUserRepository } from './modules/users/infrastructure/firestore-user-repository';

const app = createApp(
  createAppContainer({
  userRepository: new FirestoreUserRepository(firestore),
  taskRepository: new FirestoreTaskRepository(firestore),
  corsOrigin: env.CORS_ORIGIN,
  }),
);

export const api = onRequest(
  {
    cors: true,
  },
  app,
);
