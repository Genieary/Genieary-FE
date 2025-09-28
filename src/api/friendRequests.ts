// src/api/friendRequests.ts
import { ApiClient } from './apiClient';
import { getAuthToken } from '../utils/auth';

export type ReceivedFriendRequest = {
  requestId: number; requesterId: number;
  nickname: string; profileImage?: string | null;
};
export type SentFriendRequest = {
  requestId: number; receiverId: number;
  nickname: string; profileImage?: string | null;
};
type ApiEnvelope<T> = { isSuccess: boolean; code: string; message: string; result: T | null; };

export type FriendRequestBox = {
  received: ReceivedFriendRequest[];
  sent: SentFriendRequest[];
};

const api = ApiClient.getInstance();

export async function getFriendRequestBox(): Promise<FriendRequestBox> {
  const token = getAuthToken();
  const res = await api.request<ApiEnvelope<FriendRequestBox>>('api/friend/request/box', {
    method: 'GET',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if ('error' in res) throw new Error(res.error);
  return res.data?.result ?? { received: [], sent: [] };
}

export async function approveRequest(requestId: number): Promise<void> {
  const token = getAuthToken();
  const res = await api.request<ApiEnvelope<null>>('api/friend/request', {
    method: 'POST',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify({ requestId, status: 'ACCEPTED' }),
  });
  if ('error' in res) throw new Error(res.error);
  if (!res.data?.isSuccess) throw new Error(res.data?.message || '승인 실패');
}

export async function rejectRequest(requestId: number): Promise<void> {
  const token = getAuthToken();
  const res = await api.request<ApiEnvelope<null>>('api/friend/request', {
    method: 'POST',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify({ requestId, status: 'REJECTED' }),
  });
  if ('error' in res) throw new Error(res.error);
  if (!res.data?.isSuccess) throw new Error(res.data?.message || '거절 실패');
}

export const cancelSentRequest = async (requestId: number) => {
  const api = ApiClient.getInstance();
  const token = localStorage.getItem('accessToken');
  const res = await api.request<any>(`api/friend/request/${requestId}`, {
    method: 'DELETE',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if ('error' in res) throw new Error(res.error);
  if (!res.data?.isSuccess) throw new Error(res.data?.message || '취소 실패');
  return true;
};

export async function sendFriendRequest(receiverId: number): Promise<void> {
  const token = getAuthToken();
  const res = await api.request<ApiEnvelope<null>>('api/friend', {
    method: 'POST',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify({ receiverId }),
  });
  if ('error' in res) throw new Error(res.error);
  if (!res.data?.isSuccess) throw new Error(res.data?.message || '요청 실패');
}