// src/utils/chatUtils.ts
import { ChatMessageResponse } from '../types/chat';
import { Message } from '../types/chat';

export const convertMessageResponse = (apiResponse: ChatMessageResponse, currentUserId: number): Message => {
  const messageType = apiResponse.messageType === 'IMAGE' ? 'image' : 
                     apiResponse.messageType === 'FILE' ? 'file' : 'text';

  return {
    id: apiResponse.id.toString(),
    content: apiResponse.message,
    timestamp: formatTimestamp(apiResponse.sentAt),
    sentAt: apiResponse.sentAt, // 정렬용 원본 날짜 추가
    isMe: apiResponse.senderId === currentUserId,
    type: messageType
  };
};

// 시간 포맷팅 함수 (메시지 옆에 표시)
export const formatTimestamp = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

// 날짜 구분선용 포맷팅 함수
export const formatDateSeparator = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 날짜만 비교 (시간 제외)
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  if (isSameDay(date, today)) {
    return '오늘';
  } else if (isSameDay(date, yesterday)) {
    return '어제';
  } else {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// 같은 날짜인지 확인하는 함수
export const isSameDate = (date1: string | undefined, date2: string | undefined): boolean => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};
