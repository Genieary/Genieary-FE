// src/api/apiClient.ts
import { ApiResponse } from '../types/auth';

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
      
      // ✅ 로그인 토큰 가져오기
      const token = localStorage.getItem('accessToken');

      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ 자동으로 헤더에 토큰 포함
      };

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);

      // ✅ 응답이 비어있을 수도 있으니 안전하게 처리
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // ❌ 에러 응답 처리
      if (!response.ok) {
        return {
          error: data?.message || `HTTP error! status: ${response.status}`,
          status: response.status,
        };
      }

      // ✅ 성공 응답
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
