import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import ChatList from '../components/Chat/ChatList';
import ChatRoom from '../components/Chat/ChatRoom';
import { ChatRoom as ChatRoomType, Message } from '../types/chat';
import PhotoGallery from '../components/Chat/PhotoGallery';

const ChatPage: React.FC = () => {
  // 채팅방 더미 데이터
  const [chatRooms] = useState<ChatRoomType[]>([
    {
      id: '1',
      name: '신정원',
      lastMessage: '오늘 같이 커피 사갈까?',
      timestamp: '오후 9:05',
      hasUnreadMessage: false,
    },
    {
      id: '2',
      name: '정원왕',
      lastMessage: '채팅 내용 몰라몰라',
      timestamp: '어제',
      hasUnreadMessage: false,
    },
    {
      id: '3',
      name: '김철수',
      lastMessage: '안녕하세요!',
      timestamp: '2025-06-27',
      hasUnreadMessage: true,
    },
    {
      id: '4',
      name: '이영희',
      lastMessage: '내일 만날까요?',
      timestamp: '2025-06-27',
      hasUnreadMessage: true,
    }
  ]);

  // 메시지 더미 데이터
  const [messages] = useState<Message[]>([
    {
      id: '1',
      content: '오늘 같이 커피 사갈까?',
      timestamp: '오후 2:30',
      isMe: false,
      type: 'text'
    },
    {
      id: '2',
      content: '좋아요! 몇 시에 만날까요?',
      timestamp: '오후 2:32',
      isMe: true,
      type: 'text'
    }
  ]);

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
    // 실제로는 여기서 메시지를 서버로 전송하고 상태를 업데이트
  };

  // 채팅방 정보 가져오기
  const getChatRoomById = (id: string) => {
    return chatRooms.find(room => room.id === id);
  };

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
                messages={messages} 
                onSendMessage={handleSendMessage}
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
