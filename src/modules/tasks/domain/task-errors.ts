import { DomainError } from '../../../shared/errors/domain-error';
import { HTTP_STATUS } from '../../../shared/http/http-status';

export class TaskNotFoundError extends DomainError {
  constructor(taskId: string) {
    super('TASK_NOT_FOUND', 'Task not found', HTTP_STATUS.NOT_FOUND, { taskId });
    this.name = 'TaskNotFoundError';
  }
}
