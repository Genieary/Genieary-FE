export interface ChatRoom {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    hasUnreadMessage: boolean;
    avatar?: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    timestamp: string;
    isMe: boolean;
    type: 'text' | 'image';
  }
  
  // src/types/chat.ts

export interface ChatRoomResponse {
    id: number;
    roomUuid: string;
    otherUser: {
      id: number;
      nickname: string;
      imageFileName: string | null;
    };
    lastMessage: string;
    lastMessageTime: string;      // ISO String (LocalDateTime)
    unreadCount: number;
    isActive: boolean;
  }
  
  export interface ChatMessageResponse {
    id: number;
    roomUuid: string;
    senderId: number;
    senderNickname: string;
    message: string;
    messageType: 'CHAT' | 'JOIN' | 'LEAVE' | 'FILE' | 'IMAGE';
    isRead: boolean;
    sentAt: string;              // ISO String (LocalDateTime)
  }
  
  export interface WebSocketMessage {
    type: 'CHAT' | 'JOIN' | 'LEAVE' | 'READ';
    roomId: string;
    senderId: number;
    message: string;
    timestamp: string;           // ISO String (LocalDateTime)
  }


export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
  }
  