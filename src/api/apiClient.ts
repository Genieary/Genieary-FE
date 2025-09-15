// src/api/apiClient.ts
import { ApiResponse } from '../types/auth';
import { AuthService } from '../services/authService';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;
      
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // 토큰이 있으면 Authorization 헤더 추가
      const token = AuthService.getAccessToken();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
         // 401 에러일 경우 자동 로그아웃
         if (response.status === 401) {
          AuthService.logout();
          window.location.href = '/login';
         }
        return {
          error: data.message || `HTTP error! status: ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 500,
      };
    }
  }
}
