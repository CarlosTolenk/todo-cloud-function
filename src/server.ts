import { createAppContainer } from './app/app-container';
import { createApp } from './app/create-app';
import { env } from './config/env';
import { firestore } from './config/firebase';
import { FirestoreTaskRepository } from './modules/tasks/infrastructure/firestore-task-repository';
import { FirestoreUserRepository } from './modules/users/infrastructure/firestore-user-repository';
import { ConsoleLogger } from './shared/logging/logger';

const logger = new ConsoleLogger(env.LOG_LEVEL);

const app = createApp(
  createAppContainer({
  userRepository: new FirestoreUserRepository(firestore),
  taskRepository: new FirestoreTaskRepository(firestore),
  corsOrigin: env.CORS_ORIGIN,
  logger,
  }),
);

app.listen(env.PORT, () => {
  logger.info('Server started', {
    port: env.PORT,
    environment: env.NODE_ENV,
  });
});
