import { ENV } from '../../core/config/env';
import { secureStorage } from '../../security/secureStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: object;
  headers?: Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const token = await secureStorage.getToken();

  const response = await fetch(`${ENV.API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error((error as { message?: string }).message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export const httpClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', headers }),
  post: <T>(path: string, body: object) =>
    request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: object) =>
    request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body: object) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
