// src/components/Chat/ChatRoom.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Message, ChatRoomResponse } from '../../types/chat';
import { useWebSocket } from '../../hooks/useWebsocket';
import { useChatMessages } from '../../hooks/useChat';
import { formatDateSeparator, isSameDate } from '../../utils/chatUtils';
import { ReactComponent as MenuSvg } from '../../assets/list.svg';
import { ReactComponent as CameraSvg } from '../../assets/camera.svg';
import { ReactComponent as SendSvg } from '../../assets/arrow-up.svg';
import { ChatApi } from "../../api/chatApi";
import { AuthService } from '../../services/authService';

interface ChatRoomProps {
  chatRooms: ChatRoomResponse[];
}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoomResponse | null>(null);

  const chatApi = new ChatApi();

  const { sendMessage, subscribeToRoom, unsubscribeFromRoom, markAsRead, isConnected } = useWebSocket();

  // DB에서 기존 메시지 로드
  const { messages: dbMessages, loading: messagesLoading, fetchMessages } = useChatMessages(id || null);
  
  const currentUserId= AuthService.getUserId(); 

  // 채팅방 조회
useEffect(() => {
  if (!id) return;

  const fetchRoom = async () => {
    try {
      const res = await chatApi.getChatRoom(id);

      if (!res.data) {
        setCurrentRoom(null);
        return;
      }
      
      setCurrentRoom(res.data);
    } catch (err) {
      console.error(err);
      setCurrentRoom(null);
    }
  };

  fetchRoom();
}, [id]);

   // 채팅방 변경 시 DB 메시지 로드 및 실시간 메시지 초기화
   useEffect(() => {
    if (!id) return;
    
    fetchMessages();
  }, [id, fetchMessages]); 

  // 실시간 메시지 처리
  const handleNewMessage = useCallback((message: any) => {
    // 내가 보낸 메시지는 서버 브로드캐스트에서 제외
    if (message.senderId === currentUserId) return;
    
    const newMessage: Message = {
      id: message.id.toString(),
      content: message.message,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      sentAt: new Date().toISOString(), //정렬용 원본 날짜
      isMe: false,
      type: 'text'
    };
    
    setRealtimeMessages(prev => [...prev, newMessage]);
  }, [currentUserId]);

  // 방 구독 및 읽음 처리
  useEffect(() => {
    if (!id || !isConnected) return;

    subscribeToRoom(id, handleNewMessage);
    
    const timer = setTimeout(() => markAsRead(id), 500);

    return () => {
      clearTimeout(timer);
      unsubscribeFromRoom(id);
    };
  }, [id, isConnected, handleNewMessage, subscribeToRoom, unsubscribeFromRoom, markAsRead]);

    //  // DB 메시지를 UI 형태로 변환
   const convertDbMessages = useCallback((messages: any[]): Message[] => {
    return messages.map(msg => ({
      id: msg.id.toString(),
      content: msg.message,
      timestamp: new Date(msg.sentAt).toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      sentAt: msg.sentAt,
      isMe: msg.senderId === currentUserId,
      type: 'text'
    }));
  }, [currentUserId]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [realtimeMessages, dbMessages]);

  if (!currentRoom) {
    return <ChatRoomContainer>채팅방을 찾을 수 없습니다.</ChatRoomContainer>;
  }

  if (messagesLoading) {
    return <ChatRoomContainer>메시지를 불러오는 중...</ChatRoomContainer>;
  }

  const displayName = currentRoom.otherUser.nickname || `user${currentRoom.otherUser.id}`;
  const profileImage = currentRoom.otherUser.profileImage;
   
  // DB 메시지 + 실시간 메시지 통합
  const allMessages = [
    ...convertDbMessages(dbMessages),
    ...realtimeMessages
  ].sort((a, b) => {
    const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return dateA - dateB; // 오래된 메시지가 위로
  });

  const handleSend = () => {
    if (!inputValue.trim() || !id) return;

    const messageText = inputValue.trim();
    const now = new Date().toISOString();
    
    // 낙관적 업데이트
    setRealtimeMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      sentAt: now, 
      isMe: true,
      type: 'text'
    }]);

    setInputValue('');

    try {
      sendMessage(id, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('메시지 전송에 실패했습니다.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <BackButton onClick={() => navigate('/friends/chat')}>＜ 채팅 목록</BackButton>
        <UserInfo>
          <ChatTitle>{displayName}</ChatTitle>
        </UserInfo>
        <IconButton aria-label="메뉴" onClick={() => navigate(`/friends/chat/${id}/photos`)}>
          <MenuIcon />
        </IconButton>
      </ChatHeader>
      
      <MessagesContainer>
        {allMessages.length === 0 ? (
          <EmptyMessage>대화를 시작해보세요!</EmptyMessage>
        ) : (
          allMessages.map((message, index) => {
            const showDateSeparator =
              index === 0 ||
              !isSameDate(allMessages[index - 1]?.sentAt, message.sentAt);

            const isMe = message.isMe;

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && message.sentAt && (
                  <DateSeparator>
                    <DateSeparatorLine />
                    <DateSeparatorText>{formatDateSeparator(message.sentAt)}</DateSeparatorText>
                    <DateSeparatorLine />
                  </DateSeparator>
                )}

                <MessageRow isMe={isMe}>
                  {/* 상대방 메시지일 때만 프로필 표시 */}
                  {!isMe && (
                    <ProfileColumn>
                      {profileImage ? (
                        <ProfileImg
                          src={profileImage}
                          alt={`${displayName}의 프로필`}
                        />
                      ) : (
                        <DefaultAvatar>{displayName.charAt(0)}</DefaultAvatar>
                      )}
                    </ProfileColumn>
                  )}

                    <ContentColumn isMe={isMe}> 
                    {!isMe && <SenderName>{displayName}</SenderName>}
                    <MessageLine isMe={isMe}>
                      {isMe ? (
                        <>
                          <MessageTime>{message.timestamp}</MessageTime>
                          <MessageContent isMe={isMe}>{message.content}</MessageContent>
                        </>
                      ) : (
                        <>
                          <MessageContent isMe={isMe}>{message.content}</MessageContent>
                          <MessageTime>{message.timestamp}</MessageTime>
                        </>
                      )}
                    </MessageLine>
                  </ContentColumn>
                </MessageRow>
              </React.Fragment>
            );
          })
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

// 스타일 컴포넌트들
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
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
`;

const UserInfo = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

const MessagesContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
  gap: 12px;
`;

const DateSeparatorLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e0e0e0;
`;

const DateSeparatorText = styled.span`
  font-size: 12px;
  color: #999;
  font-weight: 500;
  white-space: nowrap;
`;

const MessageLine = styled.div<{ isMe: boolean }>`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  gap: 6px;
`;

const MessageContent = styled.div<{ isMe: boolean }>`
  background: ${({ isMe }) => (isMe ? '#007bff' : '#f5f5f5')};
  color: ${({ isMe }) => (isMe ? 'white' : '#333')};
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 60%;
  word-wrap: break-word;
  font-size: 14px;
  font-weight: 600;
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: #999;
  white-space: nowrap;
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

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 16px;
`;

const MessageRow = styled.div<{ isMe: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  gap: 8px;
  margin-bottom: 6px;
`;

const ProfileColumn = styled.div`
  flex-shrink: 0;
`;

const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9f7ef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2b8a3e;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
`;

const ContentColumn = styled.div<{ isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  max-width: 70%;
`;

const SenderName = styled.span`
  font-size: 12px;
  color: #777;
  margin-bottom: 2px;
  font-weight: 600;
`;


const MenuIcon = styled(MenuSvg)`width: 18px; height: 18px; fill: #666;`;
const CameraIcon = styled(CameraSvg)`width: 20px; height: 20px;`;
const SendIcon = styled(SendSvg)`width: 16px; height: 16px; fill: #fff;`;
