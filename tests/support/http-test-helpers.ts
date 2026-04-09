import { vi } from 'vitest';

export const createMockResponse = () => {
  const response = {
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
