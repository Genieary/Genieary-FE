// src/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/auth';
import { AuthService } from '../services/authService';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ✅ 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status || 500;
        const message =
          error.response?.data?.message || error.message || 'Unknown error occurred';
        return Promise.reject({ status, message });
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        url: endpoint,
        ...config,
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        error: error.message,
        status: error.status || 500,
      };
    }
  }
}
