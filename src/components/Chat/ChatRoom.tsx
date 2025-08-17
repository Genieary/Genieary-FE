import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChatMessageResponse, ChatRoomResponse } from '../../types/chat';
import { ReactComponent as MenuSvg } from '../../assets/list.svg';
import { ReactComponent as CameraSvg } from '../../assets/camera.svg';
import { ReactComponent as SendSvg } from '../../assets/arrow-up.svg';

interface ChatRoomProps {
  messages: ChatMessageResponse[];
  onSendMessage: (roomUuid: string, content: string) => void;
  chatRooms: ChatRoomResponse[];
  getChatRoomById: (id: string) => ChatRoomResponse | undefined;
  fetchMessages: (roomUuid: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  onSendMessage,
  chatRooms,
  getChatRoomById,
  fetchMessages,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 채팅방 UUID, 정보, 메시지 불러오기
  const chatRoom = id ? getChatRoomById(id) : undefined;
  useEffect(() => {
    if (chatRoom?.roomUuid) {
      fetchMessages(chatRoom.roomUuid);
    }
  }, [chatRoom?.roomUuid]);

  if (!chatRoom) {
    return <ChatRoomContainer>채팅방을 찾을 수 없습니다.</ChatRoomContainer>;
  }

  const [inputValue, setInputValue] = React.useState('');
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(chatRoom.roomUuid, inputValue);
      setInputValue('');
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
          <ChatTitle>{chatRoom.otherUser.nickname}</ChatTitle>
          <UserStatus>아이디</UserStatus>
        </UserInfo>
        <IconButton aria-label="메뉴" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((msg) => (
          <MessageGroup key={msg.id} isMe={msg.senderId === chatRoom.otherUser.id}>
            <UserAvatar />
            <MessageContent>
              <UserName>{msg.senderNickname}</UserName>
              <UserQuestion>{msg.message}</UserQuestion>
            </MessageContent>
          </MessageGroup>
        ))}
      </MessagesContainer>
      <InputContainer>
        <MessageInput
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지 입력"
        />
        <IconButton aria-label="카메라">
          <CameraIcon />
        </IconButton>
        <SendButton aria-label="전송" onClick={handleSend}>
          <SendIcon />
        </SendButton>
      </InputContainer>
    </ChatRoomContainer>
  );
};

export default ChatRoom;

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
  gap: 16px;
`;

const MessageGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff3bf;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const UserQuestion = styled.div`
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const ImageMessage = styled.div`
  margin-left: 52px;
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 150px;
  background: #ddd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
`;

const SuggestedReply = styled.button`
  font-weight: 600;
  align-self: flex-end;
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  margin-top: auto;
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

  &:hover {
    background: #f5f5f5;
  }
`;

const SendButton = styled(IconButton)`
  background: #007bff;
  width: 36px;
  height: 36px;

  &:hover {
    background: #0056b3;
  }
`;

const MenuIcon   = styled(MenuSvg)`  width: 18px; height: 18px; fill: #666; `;
const CameraIcon = styled(CameraSvg)` width: 20px; height: 20px;`;
const SendIcon   = styled(SendSvg)`   width: 16px; height: 16px; fill: #fff; `;