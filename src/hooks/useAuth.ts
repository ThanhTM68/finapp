import { useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth/auth.service';
import { LoginPayload, RegisterPayload } from '../domain/auth/auth.types';

export function useAuth() {
  const { user, isAuthenticated, clear } = useAuthStore();

  const login = useCallback(async (payload: LoginPayload) => {
    await authService.login(payload);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  return { user, isAuthenticated, login, register, logout };
}
