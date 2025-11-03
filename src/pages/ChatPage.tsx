// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import ChatList from '../components/Chat/ChatList';
import ChatRoom from '../components/Chat/ChatRoom';
import PhotoGallery from '../components/Chat/PhotoGallery';
import { useChat, useChatMessages } from '../hooks/useChat';
import { AuthService } from '../services/authService';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatRooms, loading, error, fetchChatRooms } = useChat();
  const currentUserId = AuthService.getUserId();
  
  useEffect(() => {
    if (!currentUserId) {
      alert("로그인이 필요한 서비스입니다.")
      navigate('/login', { replace: true });
    }
  }, [currentUserId, navigate]);


  // 컴포넌트 마운트 시 채팅방 목록 로드
  useEffect(() => {
    if (currentUserId) {
      fetchChatRooms();
    }
  }, [currentUserId, fetchChatRooms]);

  // 채팅방 정보 가져오기
  const getChatRoomById = (roomUuid: string) => {
    return chatRooms.find(room => room.roomUuid === roomUuid);
  };

  // 로그인하지 않은 경우 처리
  if (!currentUserId) {
    return null;
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
              <ChatRoom 
                chatRooms={chatRooms}
                getChatRoomById={getChatRoomById}
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