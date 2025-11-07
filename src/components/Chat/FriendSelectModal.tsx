import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFriendList, Friend } from "../../api/friends";
import { ChatApi } from "../../api/chatApi";
import { useNavigate } from "react-router-dom";

interface FriendSelectModalProps {
  onClose: () => void;
}

const FriendSelectModal: React.FC<FriendSelectModalProps> = ({ onClose }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<number | null>(null);
  const navigate = useNavigate();
  const chatApi = new ChatApi();

  useEffect(() => {
    (async () => {
      try {
        const list = await getFriendList();
        setFriends(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectFriend = async (friendId: number) => {
    try {
      setCreating(friendId);
      const res = await chatApi.createOrGetChatRoom(friendId);
      const roomUuid = res.data?.roomUuid;
      if (roomUuid) {
        onClose();
        navigate(`/friends/chat/${roomUuid}`);
      }
    } catch (err) {
      alert("채팅방 생성 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setCreating(null);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>친구 선택</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        {loading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : friends.length === 0 ? (
          <EmptyText>친구가 없습니다.</EmptyText>
        ) : (
          <List>
            {friends.map((f) => (
              <FriendItem key={f.friendId} onClick={() => handleSelectFriend(f.friendId)}>
                <Avatar src={f.profileImage ?? undefined} />
                <FriendName>{f.nickname}</FriendName>
                {creating === f.friendId && <LoadingText>열기...</LoadingText>}
              </FriendItem>
            ))}
          </List>
        )}
      </Modal>
    </Overlay>
  );
};

export default FriendSelectModal;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  width: 360px;
  max-height: 500px;
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const Avatar = styled.img.attrs((props: { src?: string }) => ({
  src: props.src || "https://via.placeholder.com/40?text=👤",
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const FriendName = styled.div`
  flex: 1;
  font-size: 15px;
  color: #333;
`;

const EmptyText = styled.div`
  color: #999;
  text-align: center;
  padding: 20px 0;
`;

const LoadingText = styled.div`
  font-size: 13px;
  color: #888;
`;
