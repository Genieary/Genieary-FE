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
  