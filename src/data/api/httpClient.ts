import { ENV } from '../../core/config/env';
import { secureStorage } from '../../security/secureStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: object;
  headers?: Record<string, string>;
  retried?: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await secureStorage.getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${ENV.API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await secureStorage.clearTokens();
    return null;
  }

  const envelope = (await response.json()) as ApiEnvelope<{ accessToken: string; refreshToken: string }>;
  await secureStorage.saveToken(envelope.data.accessToken);
  await secureStorage.saveRefreshToken(envelope.data.refreshToken);
  return envelope.data.accessToken;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, retried = false } = options;
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

  if (
    response.status === 401 &&
    !retried &&
    path !== '/auth/refresh' &&
    path !== '/auth/login' &&
    path !== '/auth/register'
  ) {
    const nextToken = await refreshAccessToken();
    if (nextToken) {
      return request<T>(path, { ...options, retried: true });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error((error as { message?: string }).message ?? 'Request failed');
  }

  const json = (await response.json()) as ApiEnvelope<T> | T;
  if (typeof json === 'object' && json !== null && 'success' in json && 'data' in json) {
    return (json as ApiEnvelope<T>).data;
  }

  return json as T;
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
