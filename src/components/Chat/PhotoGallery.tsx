import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ChatRoom } from '../../types/chat';

interface PhotoGalleryProps {
  getChatRoomById: (id: string) => ChatRoom | undefined;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ getChatRoomById }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const room = id ? getChatRoomById(id) : undefined;

  /* 더미 이미지 배열 (API 연동 시 교체) */
  const photos = [
    '/api/placeholder/150/150?1',
    '/api/placeholder/150/150?2',
    '/api/placeholder/150/150?3',
    '/api/placeholder/150/150?4',
    '/api/placeholder/150/150?5',
  ];

  const handleBackToChat = () => navigate(`/friends/chat/${id}`);
  const handleExitChat = () => navigate('/friends/chat');

  if (!room) return <Container>채팅방 정보를 찾을 수 없습니다.</Container>;

  return (
    <Container>
      {/* 헤더: 뒤로가기 + 사용자 정보 */}
      <Header>
        <BackButton onClick={handleBackToChat}>
          ＜ 채팅
        </BackButton>
        
        <UserInfoCenter>
          <Avatar />
          <UserInfo>
            <UserName>{room.name}</UserName>
            <NickName>아이디</NickName>
          </UserInfo>
        </UserInfoCenter>
        
        {/* 헤더 균형을 위한 빈 공간 */}
        <Spacer />
      </Header>

      {/* 사진 그리드 */}
      <Grid>
        {photos.map(src => (
          <Photo key={src}>
            <img src={src} alt="전송된 사진" />
          </Photo>
        ))}
      </Grid>

      {/* 우측 하단: 채팅방 나가기 */}
      <ExitButton onClick={handleExitChat} aria-label="채팅방 나가기">
        채팅방 나가기
      </ExitButton>
    </Container>
  );
};

export default PhotoGallery;

/* ───────────────── styled-components ───────────────── */

const Container = styled.div`
  flex: 1;
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
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
  white-space: nowrap;
`;

const UserInfoCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff3bf;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const NickName = styled.span`
  font-size: 14px;
  color: #999;
`;

const Spacer = styled.div`
  width: 60px; /* BackButton과 균형을 맞추기 위한 공간 */
`;

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 24px;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

const Photo = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const ExitButton = styled.button`
  position: absolute;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;
