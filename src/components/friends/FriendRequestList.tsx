// src/components/friends/FriendRequestList.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FriendItem from './FriendItem';
import {
  getFriendRequestBox,
  approveRequest,
  rejectRequest,
  cancelSentRequest,
  type FriendRequestBox
} from '../../api/friendRequests';

const FriendRequestList = () => {
  const [isManaging, setIsManaging] = useState(false);
  const [received, setReceived] = useState<FriendRequestBox['received']>([]);
  const [sent, setSent] = useState<FriendRequestBox['sent']>([]);

  useEffect(() => {
    (async () => {
      try {
        const box = await getFriendRequestBox();
        setReceived(box.received);
        setSent(box.sent);
      } catch (e) {
        console.error(e);
        setReceived([]);
        setSent([]);
      }
    })();
  }, []);

  const toggleManage = () => setIsManaging(v => !v);

  const onCancel = async (requestId: number) => {
  try {
    await cancelSentRequest(requestId);
    setSent(prev => prev.filter(s => s.requestId !== requestId));
  } catch (e) {
    console.error(e);
    alert('취소 중 오류가 발생했어요.');
  }
};

  const onAccept = async (requestId: number) => {
    try {
      await approveRequest(requestId);
      // 승인 성공 시 받은 요청 목록에서 제거
      setReceived(prev => prev.filter(r => r.requestId !== requestId));
      // 필요하면 친구 목록 리프레시 트리거를 추가하세요.
    } catch (err) {
      console.error(err);
      alert('승인 중 오류가 발생했어요.');
    }
  };

  const onReject = async (requestId: number) => {
    try {
      await rejectRequest(requestId);
      // 거절 성공 시 받은 요청 목록에서 제거
      setReceived(prev => prev.filter(r => r.requestId !== requestId));
    } catch (err) {
      console.error(err);
      alert('거절 중 오류가 발생했어요.');
    }
  };

  return (
    <ListWrapper>
      <Section>
        <SectionHeader>
          <SectionTitle>내가 보낸 친구 신청</SectionTitle>
          <ManageButton onClick={toggleManage}>
            {isManaging ? '친구 신청 목록 저장' : '친구 신청 목록 관리'}
          </ManageButton>
        </SectionHeader>

        {sent.length === 0 ? (
          <Empty>보낸 친구 신청이 없어요.</Empty>
        ) : (
          sent.map(s => (
            <FriendItem
              key={s.requestId}
              id={s.receiverId}
              name={s.nickname}
              avatarUrl={s.profileImage || undefined}
              showCancelButton={isManaging}
              onCancel={(_name) => onCancel(s.requestId)}
            />
          ))
        )}
      </Section>

      <Section>
        <SectionTitle>내가 받은 친구 신청</SectionTitle>
        {received.length === 0 ? (
          <Empty>받은 친구 신청이 없어요.</Empty>
        ) : (
          received.map(r => (
            <FriendItem
              key={r.requestId}
              id={r.requesterId}
              name={r.nickname}
              avatarUrl={r.profileImage || undefined}
              showAddButton
              onAdd={(_name) => onAccept(r.requestId)}
              showRejectButton={isManaging}
              onReject={(_name) => onReject(r.requestId)}
            />
          ))
        )}
      </Section>
    </ListWrapper>
  );
};

export default FriendRequestList;

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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px; /* FriendList와 동일 */
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px; /* FriendList와 동일 */
  color: #999;
  font-size: 16px;
  font-weight: 600;
`;

const SubSectionTitle = styled(SectionTitle)`
  border-top: 1px solid #eee; /* 추천 친구 섹션처럼 상단 구분선 */
  padding-top: 16px;
  margin-top: 8px;
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

const Empty = styled.div`
  color: #999;
  padding: 18px 0;
`;