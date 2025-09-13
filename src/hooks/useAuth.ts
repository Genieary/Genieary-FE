// src/hooks/useAuth.ts
import { useState } from 'react';
import { AuthApi } from '../api/authApi';
import { LoginRequest, LoginResponse, KakaoLoginRequest  } from '../types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authApi = new AuthApi();

  const saveTokens = (data: LoginResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId.toString());
  };

  //일반 로그인
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
        saveTokens(response.data);
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

  // 카카오 로그인
  const kakaoLogin = async (kakaoData: KakaoLoginRequest): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.kakaoLogin(kakaoData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }

      if (response.data) {
        saveTokens(response.data);
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '카카오 로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, kakaoLogin, loading, error };
};
