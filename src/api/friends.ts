// src/api/friends.ts
import { ApiClient } from './apiClient';

export type Friend = {
  friendId: number;
  nickname: string;
  profileImage: string | null;
};

type BackendEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
};

const api = ApiClient.getInstance();

export async function getFriendList(): Promise<Friend[]> {
  const res = await api.request<BackendEnvelope<Friend[]>>('/api/friend');
  if (res.error) throw new Error(res.error);
  const body = res.data!;
  if (!body.isSuccess) throw new Error(body.message || '친구 목록 조회 실패');
  return body.result ?? [];
}