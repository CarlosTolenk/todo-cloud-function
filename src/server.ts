import { createApp } from './app/create-app';
import { env } from './config/env';
import { firestore } from './config/firebase';
import { FirestoreTaskRepository } from './modules/tasks/infrastructure/firestore-task-repository';
import { FirestoreUserRepository } from './modules/users/infrastructure/firestore-user-repository';

const app = createApp({
  userRepository: new FirestoreUserRepository(firestore),
  taskRepository: new FirestoreTaskRepository(firestore),
  corsOrigin: env.CORS_ORIGIN,
});

app.listen(env.PORT, () => {
  // Local-only entrypoint for development outside Firebase emulators.
  console.log(`Server listening on port ${env.PORT}`);
});
