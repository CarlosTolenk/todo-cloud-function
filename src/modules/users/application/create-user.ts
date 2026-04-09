import { AppError } from '../../../shared/errors/app-error';
import { HTTP_STATUS } from '../../../shared/http/http-status';
import type { User } from '../domain/user';
import type { UserRepository } from '../domain/user-repository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        'USER_ALREADY_EXISTS',
        'A user with this email already exists',
        HTTP_STATUS.CONFLICT,
      );
    }

    return this.userRepository.create({
      email,
    });
  }
}
