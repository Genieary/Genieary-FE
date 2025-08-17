// src/api/chatApi.ts
import axiosInstance from './axiosInstance';
import { ChatRoomResponse, ChatMessageResponse, PageResponse } from '../types/chat';

export async function fetchMyChatRooms(): Promise<ChatRoomResponse[]> {
  const res = await axiosInstance.get('/rooms');
  return res.data;
}
export async function fetchChatMessages(roomUuid: string, page = 0, size = 20): Promise<PageResponse<ChatMessageResponse>> {
  const res = await axiosInstance.get(`/rooms/${roomUuid}/messages`, { params: { page, size } });
  return res.data;
}
export async function sendChatMessage(roomUuid: string, message: string): Promise<ChatMessageResponse> {
  const res = await axiosInstance.post(`/rooms/${roomUuid}/send`, { message }); // 실제 엔드포인트에 맞게 수정 필요
  return res.data;
}
export async function markChatMessagesAsRead(roomUuid: string): Promise<void> {
  await axiosInstance.put(`/rooms/${roomUuid}/read`);
}
