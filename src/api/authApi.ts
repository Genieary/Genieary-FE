// src/api/authApi.ts
import { ApiClient } from './apiClient';
import { LoginRequest, LoginResponse } from '../types/auth';

export class AuthApi {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async normalLogin(credentials: LoginRequest) {
    return await this.apiClient.request<LoginResponse>('api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // 카카오 로그인이 이미 구현되어 있다면 여기에 추가 가능
  
}
