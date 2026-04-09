import type { Request, Response } from 'express';

import { asyncHandler } from '../../../shared/http/async-handler';
import { successResponse } from '../../../shared/http/api-response';
import { HTTP_STATUS } from '../../../shared/http/http-status';
import { CreateUserUseCase } from '../application/create-user';
import { FindUserByEmailUseCase } from '../application/find-user-by-email';
import { createUserBodySchema, getUserByEmailParamsSchema } from './users.schemas';

export class UsersController {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  getByEmail = asyncHandler(async (request: Request, response: Response) => {
    const { email } = getUserByEmailParamsSchema.parse(request.params);
    const user = await this.findUserByEmailUseCase.execute(email);

    response.status(HTTP_STATUS.OK).json(successResponse(user));
  });

  create = asyncHandler(async (request: Request, response: Response) => {
    const { email } = createUserBodySchema.parse(request.body);
    const user = await this.createUserUseCase.execute(email);

    response.status(HTTP_STATUS.CREATED).json(successResponse(user));
  });
}
