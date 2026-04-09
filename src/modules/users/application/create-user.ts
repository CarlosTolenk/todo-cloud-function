import type { User } from '../domain/user';
import { UserAlreadyExistsError } from '../domain/user-errors';
import type { UserRepository } from '../domain/user-repository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsError(email);
    }

    return this.userRepository.create({
      email,
    });
  }
}
