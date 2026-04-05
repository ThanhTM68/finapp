import { httpClient } from './httpClient';
import { LoginPayload, RegisterPayload, AuthTokens, User } from '../../domain/auth/auth.types';

export const authApi = {
  login: (payload: LoginPayload) =>
    httpClient.post<{ tokens: AuthTokens; user: User }>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    httpClient.post<{ tokens: AuthTokens; user: User }>('/auth/register', payload),

  logout: () => httpClient.post<void>('/auth/logout', {}),

  refreshToken: (refreshToken: string) =>
    httpClient.post<AuthTokens>('/auth/refresh', { refreshToken }),

  resetPassword: (email: string) =>
    httpClient.post<void>('/auth/reset-password', { email }),

  getProfile: () => httpClient.get<User>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    httpClient.patch<User>('/auth/profile', data),

  deleteAccount: () => httpClient.delete<void>('/auth/account'),
};
