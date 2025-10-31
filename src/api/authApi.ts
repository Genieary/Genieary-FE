// src/api/authApi.ts
import { ApiClient } from './apiClient';
import { LoginRequest, LoginResponse, KakaoLoginRequest } from '../types/auth';

export class AuthApi {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async normalLogin(credentials: LoginRequest) {
    const res = await this.apiClient.request<LoginResponse>('/auth/login', {
      method: 'POST',
      data: credentials,
    });

    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken || '');
    }

    return res;
  }

  async kakaoLogin(kakaoData: KakaoLoginRequest) {
    const res = await this.apiClient.request<LoginResponse>(
      `/auth/kakao?code=${kakaoData.code}`,
      { method: 'GET' }
    );

    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken || '');
    }

    return res;
  }
}
