import { vi } from 'vitest';

export const createMockResponse = () => {
  const response = {
    locals: {},
    statusCode: 200,
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
};

export const flushPromises = async (): Promise<void> => {
  await Promise.resolve();
};
