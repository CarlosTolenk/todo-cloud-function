import type { Request, Response } from 'express';

import { asyncHandler } from '../../../shared/http/async-handler';
import { successResponse } from '../../../shared/http/api-response';
import { HTTP_STATUS } from '../../../shared/http/http-status';
import { CreateTaskUseCase } from '../application/create-task';
import { DeleteTaskUseCase } from '../application/delete-task';
import { GetTasksByUserUseCase } from '../application/get-tasks-by-user';
import { UpdateTaskUseCase } from '../application/update-task';
import {
  createTaskBodySchema,
  getTasksQuerySchema,
  updateTaskBodySchema,
  updateTaskParamsSchema,
} from './tasks.schemas';

export class TasksController {
  constructor(
    private readonly getTasksByUserUseCase: GetTasksByUserUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  getByUser = asyncHandler(async (request: Request, response: Response) => {
    const { userId } = getTasksQuerySchema.parse(request.query);
    const tasks = await this.getTasksByUserUseCase.execute(userId);

    response.status(HTTP_STATUS.OK).json(successResponse(tasks));
  });

  create = asyncHandler(async (request: Request, response: Response) => {
    const body = createTaskBodySchema.parse(request.body);
    const task = await this.createTaskUseCase.execute(body);

    response.status(HTTP_STATUS.CREATED).json(successResponse(task));
  });

  update = asyncHandler(async (request: Request, response: Response) => {
    const { id } = updateTaskParamsSchema.parse(request.params);
    const body = updateTaskBodySchema.parse(request.body);
    const task = await this.updateTaskUseCase.execute(id, body);

    response.status(HTTP_STATUS.OK).json(successResponse(task));
  });

  delete = asyncHandler(async (request: Request, response: Response) => {
    const { id } = updateTaskParamsSchema.parse(request.params);
    await this.deleteTaskUseCase.execute(id);

    response.status(HTTP_STATUS.OK).json(successResponse({ id }));
  });
}
