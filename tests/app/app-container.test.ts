import { describe, expect, it } from 'vitest';

import { AppContainer, createAppContainer } from '../../src/app/app-container';
import { InMemoryTaskRepository } from '../support/in-memory-task-repository';
import { InMemoryUserRepository } from '../support/in-memory-user-repository';

describe('AppContainer', () => {
  it('creates a typed container instance', () => {
    const container = createAppContainer({
      userRepository: new InMemoryUserRepository(),
      taskRepository: new InMemoryTaskRepository(),
      corsOrigin: 'http://localhost:4200',
    });

    expect(container).toBeInstanceOf(AppContainer);
    expect(container.corsOrigin).toBe('http://localhost:4200');
  });

  it('memoizes controllers as singletons inside the container', () => {
    const container = createAppContainer({
      userRepository: new InMemoryUserRepository(),
      taskRepository: new InMemoryTaskRepository(),
      corsOrigin: '*',
    });

    expect(container.usersController).toBe(container.usersController);
    expect(container.tasksController).toBe(container.tasksController);
  });
});
