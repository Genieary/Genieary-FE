// src/utils/auth.ts
import { LoginResponse } from '../types/auth';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
const UID = 'userId';

export function saveTokens(payload: LoginResponse) {
  localStorage.setItem(ACCESS, payload.accessToken);
  localStorage.setItem(REFRESH, payload.refreshToken);
  localStorage.setItem(UID, String(payload.userId));
}

export function getAuthToken(): string | null {
  return localStorage.getItem(ACCESS);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(UID);
}
