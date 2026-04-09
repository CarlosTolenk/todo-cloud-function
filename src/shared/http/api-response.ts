export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export const successResponse = <T>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
});

export const errorResponse = (
  code: string,
  message: string,
  details?: unknown,
): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    ...(details !== undefined ? { details } : {}),
  },
});
