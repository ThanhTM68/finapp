import { authApi } from '../api/auth.api';
import { secureStorage } from '../../security/secureStore';
import { LoginPayload, RegisterPayload, AuthTokens, User } from '../../domain/auth/auth.types';

export const authRepository = {
  async login(payload: LoginPayload): Promise<{ tokens: AuthTokens; user: User }> {
    const result = await authApi.login(payload);
    await secureStorage.saveToken(result.tokens.accessToken);
    await secureStorage.saveRefreshToken(result.tokens.refreshToken);
    return result;
  },

  async register(payload: RegisterPayload): Promise<{ tokens: AuthTokens; user: User }> {
    const result = await authApi.register(payload);
    await secureStorage.saveToken(result.tokens.accessToken);
    await secureStorage.saveRefreshToken(result.tokens.refreshToken);
    return result;
  },

  async logout(): Promise<void> {
    await authApi.logout().catch(() => null);
    await secureStorage.clearTokens();
  },

  async getProfile(): Promise<User> {
    return authApi.getProfile();
  },
};
