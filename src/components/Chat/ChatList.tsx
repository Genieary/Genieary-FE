import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChatRoomResponse } from '../../types/chat';
import { formatTimestamp} from '../../utils/chatUtils';
import { ReactComponent as PlusSvg } from '../../assets/plus.svg';
import { ReactComponent as SearchSvg } from '../../assets/search.svg';
//TODO: 읽음 로직 추가, 프로필 이미지

interface ChatListProps {
  chatRooms: ChatRoomResponse[];
}

const ChatList: React.FC<ChatListProps> = ({ chatRooms }) => {
  return (
    <ChatListContainer>
      <Header>
        <Title>나의 채팅</Title>
        <Actions>
          <IconButton aria-label="검색">
            <SearchIcon />
          </IconButton>

          <IconButton aria-label="새 채팅 시작">
            <PlusIcon />
          </IconButton>
        </Actions>
      </Header>
      
      {chatRooms.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyText>이전 채팅이 없어요! +를 눌러 채팅을 시작해보세요!</EmptyText>
        </EmptyState>
      ) : (
        <ChatRoomList>
          {chatRooms.map((room) => {
            const displayName = room.otherUser.nickname || `user${room.otherUser.id}`;
            const hasUnreadMessage = false; // 추후 읽음 상태 로직 추가
            
            return (
              <ChatRoomItem key={room.roomUuid} to={`/friends/chat/${room.roomUuid}`}>
                <AvatarContainer>
                  <Avatar/>
                  {hasUnreadMessage && <UnreadDot />}
                </AvatarContainer>
                <ChatInfo>
                  <RoomName>{displayName}</RoomName>
                  <LastMessage>
                    {room.lastMessage || '대화를 시작해보세요'}
                  </LastMessage>
                </ChatInfo>
                <Timestamp>
                  {room.lastMessageTime ? formatTimestamp(room.lastMessageTime) : ''}
                </Timestamp>
              </ChatRoomItem>
            );
          })}
        </ChatRoomList>
      )}
    </ChatListContainer>
  );
};

export default ChatList;

// 스타일드 컴포넌트들
const ChatListContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
  margin-left: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background: #f5f5f5;
  }
`;

const PlusIcon = styled(PlusSvg)`
  width: 20px;
  height: 20px;
  fill: #333;
`;

const SearchIcon = styled(SearchSvg)`
  width: 18px;
  height: 18px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
`;

const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChatRoomItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9f9f9;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff3bf;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  user-select: none;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;
`;

const ChatInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RoomName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
`;
