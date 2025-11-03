// src/types/auth.ts
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface KakaoLoginRequest {
    code: string;
  }

  export interface LoginResponse {
    userId: number;
    accessToken: string;
    refreshToken: string;
  }

  export interface SignupRequest {
    email: string;
    password: string;
    passwordCheck: string;
  }
  
  export interface SignupResponse {
    userId: number;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
  }
  