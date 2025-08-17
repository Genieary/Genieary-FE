import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import ChatList from '../components/Chat/ChatList';
import ChatRoom from '../components/Chat/ChatRoom';
import PhotoGallery from '../components/Chat/PhotoGallery';
import { ChatRoomResponse, ChatMessageResponse } from '../types/chat';
import { fetchMyChatRooms, fetchChatMessages, sendChatMessage } from '../api/chatApi';

const ChatPage: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoomResponse[]>([]);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  
  useEffect(() => {
    fetchMyChatRooms().then(setChatRooms);
  }, []);

  // 채팅방 정보 getter
  const getChatRoomById = (id: string) => chatRooms.find(r => r.id === Number(id));

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
            path=":id" 
            element={
              <ChatRoom 
                messages={messages}
                onSendMessage={async (roomUuid, content) => {
                  await sendChatMessage(roomUuid, content);
                  const updated = await fetchChatMessages(roomUuid);
                  setMessages(updated.content);
                }}
                chatRooms={chatRooms}
                getChatRoomById={getChatRoomById}
                fetchMessages={async (roomUuid) => {
                  const res = await fetchChatMessages(roomUuid);
                  setMessages(res.content);
                }}
              />
            } 
          />
          <Route path=":id/photos" element={
            <PhotoGallery getChatRoomById={getChatRoomById} />
          }/>
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
