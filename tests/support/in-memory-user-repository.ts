import type { CreateUserInput, User } from '../../src/modules/users/domain/user';
import type { UserRepository } from '../../src/modules/users/domain/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }

    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      id: `user-${this.users.size + 1}`,
      email: input.email,
      createdAt: new Date().toISOString(),
    };

    this.users.set(user.id, user);

    return user;
  }
}
