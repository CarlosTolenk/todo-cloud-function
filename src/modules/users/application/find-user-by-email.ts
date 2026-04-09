import type { User } from '../domain/user';
import type { UserRepository } from '../domain/user-repository';

export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
