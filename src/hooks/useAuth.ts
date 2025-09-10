// src/hooks/useAuth.ts
import { useState } from 'react';
import { AuthApi } from '../api/authApi';
import { LoginRequest, LoginResponse } from '../types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authApi = new AuthApi();

  const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.normalLogin(credentials);
      
      if (response.error) {
        setError(response.error);
        return null;
      }

      if (response.data) {
        // 토큰 저장 (localStorage 또는 sessionStorage)
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userId', response.data.userId.toString());
        
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
