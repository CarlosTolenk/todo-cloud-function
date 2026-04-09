import { DomainError } from '../../../shared/errors/domain-error';
import { HTTP_STATUS } from '../../../shared/http/http-status';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(
      'USER_ALREADY_EXISTS',
      'A user with this email already exists',
      HTTP_STATUS.CONFLICT,
      { email },
    );
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super('USER_NOT_FOUND', 'User not found', HTTP_STATUS.NOT_FOUND, { userId });
    this.name = 'UserNotFoundError';
  }
}
