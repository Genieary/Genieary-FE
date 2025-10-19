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

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;

      const token = localStorage.getItem('accessToken');

      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const config: RequestInit = {
        // 프런트가 쿠키를 쓸 일이 생기면 아래 주석 해제
        // credentials: 'include',
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {}),
        },
      };

      const res = await fetch(url, config);

      // 본문이 없을 수도 있으니 안전 파싱
      let data: any = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await res.json();
      }

      // 백엔드가 ApiResponse 래퍼를 줄 때 실패인 경우까지 에러로 매핑
      if (!res.ok || (data && data.isSuccess === false)) {
        const message =
          (data && (data.message || data.error)) ||
          `HTTP error! status: ${res.status}`;
        return { error: message, status: res.status };
      }

      return { data, status: res.status };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Unknown error occurred',
        status: 500,
      };
    }
  }
}