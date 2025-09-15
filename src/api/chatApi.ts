import { ApiClient } from './apiClient';
import { 
  ChatRoomResponse, 
  ChatMessageResponse, 
  CreateChatRoomRequest,
  PaginatedResponse 
} from '../types/chat';

export class ChatApi {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  // 채팅방 생성 또는 기존 채팅방 조회
  async createOrGetChatRoom(friendId: number) {
    return await this.apiClient.request<ChatRoomResponse>(`api/chat/rooms?friendId=${friendId}`, {
      method: 'POST',
    });
  }

  // 사용자의 채팅방 목록 조회
  async getUserChatRooms() {
    return await this.apiClient.request<ChatRoomResponse[]>('api/chat/rooms', {
      method: 'GET',
    });
  }

  // 특정 채팅방의 메시지 조회 (페이징)
  async getChatMessages(roomUuid: string, page: number = 0, size: number = 20) {
    return await this.apiClient.request<PaginatedResponse<ChatMessageResponse>>(
      `api/chat/rooms/${roomUuid}/messages?page=${page}&size=${size}`,
      {
        method: 'GET',
      }
    );
  }
}
