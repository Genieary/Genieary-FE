// src/components/Chat/ChatRoom.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Message, ChatRoomResponse } from '../../types/chat';
import { useWebSocket } from '../../hooks/useWebsocket';
import { ReactComponent as MenuSvg } from '../../assets/list.svg';
import { ReactComponent as CameraSvg } from '../../assets/camera.svg';
import { ReactComponent as SendSvg } from '../../assets/arrow-up.svg';

interface ChatRoomProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  chatRooms: ChatRoomResponse[];
  getChatRoomById: (id: string) => ChatRoomResponse | undefined;
}

// src/components/Chat/ChatRoom.tsx (수정된 부분)
const ChatRoom: React.FC<ChatRoomProps> = ({ 
  messages, 
  onSendMessage, 
  chatRooms, 
  getChatRoomById 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSubscribed = useRef(false);
  const { sendMessage, subscribeToRoom, unsubscribeFromRoom, markAsRead, isConnected, connectionError } = useWebSocket();

  const currentChatRoom = id ? getChatRoomById(id) : null;
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  // 메시지 변환 함수
  const convertToMessage = useCallback((apiMessage: any): Message => {
    return {
      id: apiMessage.id ? apiMessage.id.toString() : Date.now().toString(),
      content: apiMessage.message || apiMessage.content,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      isMe: apiMessage.senderId === currentUserId,
      type: 'text'
    };
  }, [currentUserId]);

  // 실시간 메시지 처리 (수정됨)
  const handleNewMessage = useCallback((message: any) => {
    console.log('Received WebSocket message:', message);
    
    // 내가 보낸 메시지는 서버 브로드캐스트에서 제외 (이미 낙관적 업데이트로 표시됨)
    if (message.senderId === currentUserId) {
      console.log('Ignoring my own message from server broadcast');
      return;
    }
    
    const newMessage = convertToMessage(message);
    setRealtimeMessages(prev => {
      // 중복 메시지 방지
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  }, [convertToMessage, currentUserId]);

  // 방 구독 - 한 번만 실행
  useEffect(() => {
    if (!id || !isConnected || isSubscribed.current) return;

    const subscribeAsync = async () => {
      try {
        console.log(`Subscribing to room: ${id}`);
        await subscribeToRoom(id, handleNewMessage);
        isSubscribed.current = true;
        console.log(`Successfully subscribed to room: ${id}`);
      } catch (error) {
        console.error('Failed to subscribe to room:', error);
        isSubscribed.current = false;
      }
    };

    subscribeAsync();

    return () => {
      if (isSubscribed.current) {
        console.log(`Unsubscribing from room: ${id}`);
        unsubscribeFromRoom(id);
        isSubscribed.current = false;
      }
    };
  }, [id, isConnected]);

  // 읽음 처리 - 한 번만 실행
  useEffect(() => {
    if (!id || !isConnected) return;

    const markAsReadAsync = async () => {
      try {
        await markAsRead(id);
        console.log(`Marked messages as read for room: ${id}`);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    };

    const timer = setTimeout(() => {
      markAsReadAsync();
    }, 500);

    return () => clearTimeout(timer);
  }, [id, isConnected]);

  // 스크롤 최하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [realtimeMessages]);

  // 방이 변경될 때 실시간 메시지 초기화
  useEffect(() => {
    setRealtimeMessages([]);
    isSubscribed.current = false;
  }, [id]);

  // 연결 상태 표시 생략...

  const displayName = currentChatRoom?.otherUser.nickname || `사용자 ${currentChatRoom?.otherUser.id}`;
  const allMessages = [...messages, ...realtimeMessages];

  const handleSend = async () => {
    if (!inputValue.trim() || !id) return;

    const messageText = inputValue.trim();
    const tempMessageId = `temp-${Date.now()}`;
    
    // 1. 즉시 UI에 내 메시지 표시 (낙관적 업데이트)
    const myMessage: Message = {
      id: tempMessageId,
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      isMe: true,
      type: 'text'
    };

    setRealtimeMessages(prev => [...prev, myMessage]);
    setInputValue(''); // 즉시 입력창 비우기

    try {
      console.log(`Sending message to room ${id}:`, messageText);
      await sendMessage(id, messageText);
      console.log('Message sent successfully');
      
      // 서버에서 내 메시지가 브로드캐스트되면 handleNewMessage에서 필터링됨
      
    } catch (error) {
      console.error('Failed to send message via WebSocket:', error);
      
      // 전송 실패 시 임시 메시지 제거하고 입력값 복구
      setRealtimeMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
      setInputValue(messageText);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMenuClick = () => navigate(`/friends/chat/${id}/photos`);
  const handleBack = () => navigate('/friends/chat');

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <BackButton onClick={handleBack}>＜ 채팅 목록</BackButton>
        <UserInfo>
          <ChatTitle>{displayName}</ChatTitle>
          <UserStatus>온라인</UserStatus>
        </UserInfo>
        <IconButton aria-label="메뉴" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
      </ChatHeader>
      
      <MessagesContainer>
        {allMessages.length === 0 ? (
          <EmptyMessage>
            대화를 시작해보세요!
          </EmptyMessage>
        ) : (
          allMessages.map((message) => (
            <MessageBubble key={message.id} isMe={message.isMe}>
              <MessageContent isMe={message.isMe}>
                {message.content}
              </MessageContent>
              <MessageTime>{message.timestamp}</MessageTime>
            </MessageBubble>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지 입력"
          disabled={!isConnected}
        />
        <IconButton aria-label="카메라" disabled={!isConnected}>
          <CameraIcon />      
        </IconButton>
        <SendButton 
          aria-label="전송" 
          onClick={handleSend}
          disabled={!inputValue.trim() || !isConnected}
        >
          <SendIcon />
        </SendButton>
      </InputContainer>
    </ChatRoomContainer>
  );
};

export default ChatRoom;

// 기존 스타일 + 추가 스타일
const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 16px;
`;

// 나머지 스타일 컴포넌트들은 동일...
const ChatRoomContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ChatTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const UserStatus = styled.span`
  font-size: 14px;
  color: #999;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div<{ isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isMe ? 'flex-end' : 'flex-start'};
  gap: 4px;
`;

const MessageContent = styled.div<{ isMe: boolean }>`
  background: ${props => props.isMe ? '#007bff' : '#f5f5f5'};
  color: ${props => props.isMe ? 'white' : '#333'};
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
`;

const MessageTime = styled.span`
  font-size: 12px;
  color: #999;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #eee;
  gap: 12px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #007bff;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled(IconButton)`
  background: #007bff;
  width: 36px;
  height: 36px;

  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
  }
`;

const MenuIcon = styled(MenuSvg)`width: 18px; height: 18px; fill: #666;`;
const CameraIcon = styled(CameraSvg)`width: 20px; height: 20px;`;
const SendIcon = styled(SendSvg)`width: 16px; height: 16px; fill: #fff;`;
