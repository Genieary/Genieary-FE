// src/api/friends.ts
import { ApiClient } from './apiClient';
import { getAuthToken } from '../utils/auth';

export type Friend = { friendId: number; nickname: string; profileImage?: string | null };

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
};

const api = ApiClient.getInstance();

export async function getFriendList(): Promise<Friend[]> {
  const token = getAuthToken();
  const res = await api.request<ApiEnvelope<Friend[]>>('api/friend', {
    method: 'GET',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if ('error' in res) throw new Error(res.error);
  return res.data?.result ?? [];
}

export async function deleteFriend(friendUserId: number): Promise<void> {
  const token = getAuthToken();
  const res = await api.request<ApiEnvelope<null>>(`api/friend/${friendUserId}`, {
    method: 'DELETE',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if ('error' in res) throw new Error(res.error);
  if (!res.data?.isSuccess) throw new Error(res.data?.message || '삭제 실패');
}