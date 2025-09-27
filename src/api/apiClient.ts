// src/api/apiClient.ts
import { ApiResponse } from '../types/auth';

const API_BASE_URL =
  process.env.REACT_APP_API_URL /* CRA */ ||
  (import.meta as any)?.env?.VITE_API_BASE_URL /* Vite */ ||
  'http://localhost:8080';

export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL.replace(/\/+$/, ''); // trailing slash 제거
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) ApiClient.instance = new ApiClient();
    return ApiClient.instance;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;

      const token = localStorage.getItem('accessToken');
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;

      const config: RequestInit = {
        method: 'GET',
        ...options,
        headers: { ...defaultHeaders, ...(options.headers as any) },
      };

      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return { error: (data && data.message) || `HTTP ${response.status}`, status: response.status };
      }
      return { data, status: response.status };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }
}
