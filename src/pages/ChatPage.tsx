// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import ChatList from '../components/Chat/ChatList';
import ChatRoom from '../components/Chat/ChatRoom';
import PhotoGallery from '../components/Chat/PhotoGallery';
import { Message, ChatRoomResponse } from '../types/chat';
import { useChat, useChatMessages } from '../hooks/useChat';
import { convertMessageResponse } from '../utils/chatUtils';
import { AuthService } from '../services/authService';

const ChatPage: React.FC = () => {
  const { chatRooms, loading, error, fetchChatRooms } = useChat();
  const currentUserId = AuthService.getUserId();

  // 컴포넌트 마운트 시 채팅방 목록 로드
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
    // WebSocket 구현 시 여기에 메시지 전송 로직 추가
  };

  // 채팅방 정보 가져오기
  const getChatRoomById = (roomUuid: string) => {
    return chatRooms.find(room => room.roomUuid === roomUuid);
  };

  // 로그인하지 않은 경우 처리
  if (!currentUserId) {
    return (
      <PageContainer>
        <FriendSidebar />
        <ContentArea>
          <ErrorContainer>
            <div>로그인이 필요합니다.</div>
          </ErrorContainer>
        </ContentArea>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <FriendSidebar />
        <ContentArea>
          <LoadingContainer>
            <div>채팅방을 불러오는 중...</div>
          </LoadingContainer>
        </ContentArea>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <FriendSidebar />
        <ContentArea>
          <ErrorContainer>
            <div>오류가 발생했습니다: {error}</div>
          </ErrorContainer>
        </ContentArea>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FriendSidebar />
      <ContentArea>
        <Routes>
          <Route 
            path="/" 
            element={<ChatList chatRooms={chatRooms} />} 
          />
          <Route 
            path="/:id" 
            element={
              <ChatRoomWithData 
                onSendMessage={handleSendMessage}
                chatRooms={chatRooms}
                getChatRoomById={getChatRoomById}
                currentUserId={currentUserId}
              />
            } 
          />
          <Route path=":id/photos" element={
             <PhotoGallery getChatRoomById={getChatRoomById} />
             }
         />
        </Routes>
      </ContentArea>
    </PageContainer>
  );
};

// ChatRoom 컴포넌트에 데이터 로딩 로직을 추가한 래퍼 컴포넌트
interface ChatRoomWithDataProps {
  onSendMessage: (content: string) => void;
  chatRooms: ChatRoomResponse[];
  getChatRoomById: (roomUuid: string) => ChatRoomResponse | undefined;
  currentUserId: number;
}

const ChatRoomWithData: React.FC<ChatRoomWithDataProps> = ({ 
  onSendMessage, 
  chatRooms, 
  getChatRoomById,
  currentUserId 
}) => {
  const { id } = useParams<{ id: string }>();
  const { messages: apiMessages, loading, error } = useChatMessages(id || null);
  const [messages, setMessages] = useState<Message[]>([]);

  // API 메시지를 UI 형태로 변환
  useEffect(() => {
    if (apiMessages.length > 0 && currentUserId) {
      const convertedMessages = apiMessages.map(msg => 
        convertMessageResponse(msg, currentUserId)
      );
      setMessages(convertedMessages);
    }
  }, [apiMessages, currentUserId]);

  if (loading) return <div>메시지를 불러오는 중...</div>;
  if (error) return <div>메시지 로드 중 오류가 발생했습니다: {error}</div>;
  
  return (
    <ChatRoom 
      messages={messages}
      onSendMessage={onSendMessage}
      chatRooms={chatRooms}
      getChatRoomById={getChatRoomById}
    />
  );
};

export default ChatPage;


const PageContainer = styled.div`
  display: flex;
  align-items: flex-start; 
  gap: 32px;
  margin: 0 auto;
  padding: 32px;
   height: calc(100vh - 200px);
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
align-self: stretch;
`;


const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  gap: 16px;
  
  button {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    
    &:hover {
      background: #0056b3;
    }
  }
`;