// src/utils/chatUtils.ts
import { ChatMessageResponse } from '../types/chat';
import { Message } from '../types/chat';

export const convertMessageResponse = (apiResponse: ChatMessageResponse, currentUserId: number): Message => {
  let messageType: 'text' | 'image' | 'file' = 'text';
  
  switch (apiResponse.messageType) {
    case 'IMAGE':
      messageType = 'image';
      break;
    case 'FILE':
      messageType = 'file';
      break;
    case 'CHAT':
    case 'JOIN':
    case 'LEAVE':
    default:
      messageType = 'text';
      break;
  }

  return {
    id: apiResponse.id.toString(),
    content: apiResponse.message,
    timestamp: formatTimestamp(apiResponse.sentAt),
    isMe: apiResponse.senderId === currentUserId,
    type: messageType
  };
};

// 시간 포맷팅 함수
export const formatTimestamp = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString('ko-KR', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  } else if (days === 1) {
    return '어제';
  } else if (days < 7) {
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', { 
      month: 'numeric', 
      day: 'numeric' 
    });
  }
};
