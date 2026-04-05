import { authRepository } from '../../data/repositories/auth.repository';
import { useAuthStore } from '../../store/auth.store';
import { LoginPayload, RegisterPayload } from '../../domain/auth/auth.types';

export const authService = {
  async login(payload: LoginPayload): Promise<void> {
    const result = await authRepository.login(payload);
    useAuthStore.getState().setUser(result.user);
    useAuthStore.getState().setAuthenticated(true);
  },

  async register(payload: RegisterPayload): Promise<void> {
    const result = await authRepository.register(payload);
    useAuthStore.getState().setUser(result.user);
    useAuthStore.getState().setAuthenticated(true);
  },

  async logout(): Promise<void> {
    await authRepository.logout();
    useAuthStore.getState().clear();
  },

  async loadProfile(): Promise<void> {
    const user = await authRepository.getProfile();
    useAuthStore.getState().setUser(user);
  },
};
