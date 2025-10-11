// src/api/authApi.ts
import { ApiClient } from './apiClient';
import { LoginRequest, LoginResponse, KakaoLoginRequest } from '../types/auth';

export class AuthApi {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  // ✅ 일반 로그인
  async normalLogin(credentials: LoginRequest) {
    const res = await this.apiClient.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // ✅ 여기서 data → result → accessToken 으로 접근
    const accessToken = res.data?.accessToken;
    const refreshToken = res.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
    }

    return res;
  }

  // ✅ 카카오 로그인
  async kakaoLogin(kakaoData: KakaoLoginRequest) {
    const res = await this.apiClient.request<LoginResponse>(
      `/auth/kakao?code=${kakaoData.code}`,
      { method: 'GET' }
    );

    const accessToken = res.data?.accessToken;
    const refreshToken = res.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
    }

    return res;
  }
}
