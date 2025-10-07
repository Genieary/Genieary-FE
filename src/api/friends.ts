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

export type FriendSearchResult = {
  friendId: number;
  nickname: string;
  profileImage?: string | null;
  email: string;
};

export async function searchFriends(
  nickname: string,
  page = 0,
  size = 10
): Promise<FriendSearchResult[]> {
  const token = getAuthToken();
  const qs = new URLSearchParams({
    nickname,
    page: String(page),
    size: String(size),
  }).toString();

  const res = await api.request<ApiEnvelope<FriendSearchResult[]>>(
    `api/friend/search?${qs}`,
    {
      method: 'GET',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    }
  );

  if ('error' in res) throw new Error(res.error);
  return res.data?.result ?? [];
}

export type RecommendedFriend = {
  userId: number;
  nickname: string;
  profileImg?: string | null;
  totalOverlap: number;
  personalityOverlap: number;
  interestOverlap: number;
};

export async function getRecommendedFriends(params?: {
  mode?: 'overlap' | 'random';   // 1번 방식: 하나의 엔드포인트에서 모드 전환
  limit?: number;                // 최대 추천 수
  overlapMin?: number;           // overlap 기준 (기본 2)
}): Promise<RecommendedFriend[]> {
  const token = getAuthToken();
  const q = new URLSearchParams();
  if (params?.mode) q.set('mode', params.mode);
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.overlapMin) q.set('overlapMin', String(params.overlapMin));

  const path = q.toString()
    ? `api/friend/recommendations?${q}`
    : 'api/friend/recommendations';

  const res = await api.request<ApiEnvelope<RecommendedFriend[]>>(path, {
    method: 'GET',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });

  if ('error' in res) throw new Error(res.error);
  return res.data?.result ?? [];
}