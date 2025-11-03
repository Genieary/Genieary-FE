// src/api/authApi.ts
import { ApiClient } from './apiClient';
import { LoginRequest, LoginResponse, KakaoLoginRequest, SignupRequest, SignupResponse } from '../types/auth';

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

  async signup(data: SignupRequest) {
    const res = await this.apiClient.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      data,
    });

    if (!res.data) {
      throw new Error(res.error || '회원가입 요청 실패');
    }

    return res.data;
  }

  async checkEmail(email: string): Promise<boolean> {
    const res = await this.apiClient.request<boolean>('/auth/check-email', {
      method: 'POST',
      data: { email },
    });

    if (res.error) {
      throw new Error(res.error);
    }
    return res.data ?? false;
  }
}
