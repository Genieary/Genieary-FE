// src/components/friends/FriendList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import FriendItem from './FriendItem';
import styled from 'styled-components';
import {
  getFriendList,
  deleteFriend,
  Friend,
  RecommendedFriend,
  getRecommendedFriends,
} from '../../api/friends';
import { sendFriendRequest } from '../../api/friendRequests';

const FriendList = () => {
  const [isManaging, setIsManaging] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  const [reco, setReco] = useState<RecommendedFriend[]>([]);
  const [recoMode, setRecoMode] = useState<'overlap' | 'random'>('overlap');
  const [loadingReco, setLoadingReco] = useState(false);

  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentIds, setSentIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const list = await getFriendList();
        setFriends(list);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const fetchReco = useCallback(async () => {
    setLoadingReco(true);
    try {
      const list = await getRecommendedFriends({
        mode: recoMode,
        overlapMin: 2,
        limit: 5,
      });
      setReco(list);
    } catch (e) {
      console.error(e);
      setReco([]);
    } finally {
      setLoadingReco(false);
    }
  }, [recoMode]);

  useEffect(() => {
    fetchReco();
  }, [fetchReco]);

  const handleToggleManage = () => setIsManaging(v => !v);

  const handleDelete = async (friendUserId: number) => {
    if (!window.confirm('정말 삭제할까요?')) return;
    try {
      await deleteFriend(friendUserId);
      setFriends(prev => prev.filter(f => f.friendId !== friendUserId));
      alert('삭제되었습니다.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '서버 에러, 관리자에게 문의 바랍니다.';
      alert(msg);
    }
  };

  const handleAdd = async (targetUserId: number) => {
    if (sendingId !== null) return;
    try {
      setSendingId(targetUserId);
      await sendFriendRequest(targetUserId);
      setReco(prev => prev.filter(u => u.userId !== targetUserId));
    } catch (e) {
      const msg = e instanceof Error ? e.message : '요청 실패';
      alert(msg);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <ListWrapper>
      <Section>
        <SectionHeader>
          <SectionTitle>친구</SectionTitle>
          <ManageButton onClick={handleToggleManage}>
            {isManaging ? '친구 목록 저장' : '친구 목록 관리'}
          </ManageButton>
        </SectionHeader>

        {friends.length === 0 ? (
          <EmptyRow>아직 친구가 없어요.</EmptyRow>
        ) : (
          friends.map(f => (
            <FriendItem
              key={f.friendId}
              id={f.friendId}
              name={f.nickname}
              avatarUrl={f.profileImage ?? undefined} // 우선 친구목록의 profile url 만 연결
              showDeleteButton={isManaging}
              onDelete={handleDelete}
            />
          ))
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>추천 친구</SectionTitle>
        </SectionHeader>

        {loadingReco ? (
          <Info>불러오는 중…</Info>
        ) : reco.length === 0 ? (
          <EmptyRow>추천할 친구가 없어요.</EmptyRow>
        ) : (
          reco.map(u => (
            <FriendItem
              key={u.userId}
              id={u.userId}
              name={u.nickname}
              profileImg={u.profileImg ?? undefined}
              showAddButton={!sentIds.has(u.userId) && sendingId !== u.userId}
              onAdd={handleAdd}
            />
          ))
        )}
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

const EmptyRow = styled.div`
  padding: 24px 0;
  color: #aaa;
  font-size: 14px;
  border-bottom: 1px solid #eee;
`;