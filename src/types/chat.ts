
  export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  type: 'text' | 'image'| 'file';
}
 
export interface ChatRoomResponse {
  id: number;
  roomUuid: string;
  otherUser: UserResponse;
  lastMessage: string | null;
  lastMessageTime: string | null;
  isActive: boolean;
}

export interface UserResponse {
  id: number;
  nickname: string| null;
  imageFileName: string| null;
}

export interface ChatMessageResponse {
  id: number;
  roomUuid: string;
  senderId: number;
  senderNickname: string;
  message: string;
  messageType: 'CHAT' | 'JOIN' | 'LEAVE' | 'FILE' | 'IMAGE';
  isRead: boolean;
  sentAt: string;
}

export interface CreateChatRoomRequest {
  friendId: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
  