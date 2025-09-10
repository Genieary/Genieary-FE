// src/api/authApi.ts
import { ApiClient } from './apiClient';
import { LoginRequest, LoginResponse, KakaoLoginRequest } from '../types/auth';

export class AuthApi {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  // 일반 로그인
  async normalLogin(credentials: LoginRequest) {
    return await this.apiClient.request<LoginResponse>('api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // 카카오 로그인
  async kakaoLogin(kakaoData: KakaoLoginRequest) {
    return await this.apiClient.request<LoginResponse>(`api/auth/kakao?code=${kakaoData.code}`, {
      method: 'GET',
    });
  }
  
}
