// src/components/FriendList.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FriendItem from './FriendItem';
import { getFriendList, Friend } from '../../api/friends';

const recommendedFriends = ['가네키 켄'];

const FriendList = () => {
  const [isManaging, setIsManaging] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleToggleManage = () => setIsManaging(v => !v);

  const handleDelete = (name: string) => {
    // TODO: /api/friend/{id} 삭제 API 연결 예정
    alert(`'${name}' 삭제 (stub)`);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getFriendList();
        setFriends(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : '친구 목록 불러오기 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ListWrapper>
      <Section>
        <SectionHeader>
          <SectionTitle>친구</SectionTitle>
          <ManageButton onClick={handleToggleManage}>
            {isManaging ? '친구 목록 저장' : '친구 목록 관리'}
          </ManageButton>
        </SectionHeader>

        {loading && <Info>불러오는 중…</Info>}
        {error && <Info style={{ color: '#e85c5a' }}>에러: {error}</Info>}
        {!loading && !error && friends.length === 0 && <Info>친구가 없습니다.</Info>}

        {!loading && !error && friends.map((f) => (
          <FriendItem
            key={f.friendId}
            name={f.nickname}
            avatarUrl={f.profileImage}
            showDeleteButton={isManaging}
            onDelete={handleDelete}
          />
        ))}
      </Section>

      <Section>
        <SectionTitle>추천 친구</SectionTitle>
        {recommendedFriends.map((friend) => (
          <FriendItem key={friend} name={friend} showAddButton />
        ))}
      </Section>
    </ListWrapper>
  );
};

export default FriendList;

const ListWrapper = styled.div`
  flex-grow: 1;
  background-color: white;
  border-radius: 16px;
  padding: 8px 32px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  color: #999;
  font-size: 16px;
  font-weight: 600;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
`;

const ManageButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: underline;
  &:hover { color: #555; }
`;

const Info = styled.div`
  padding: 16px 0;
  color: #666;
`;