import React, { useState } from 'react';
import styled from 'styled-components';
import FriendItem from './FriendItem';

const sentRequests = ['정원쨩', '권아림', '아리무', '도카쨩'];
const receivedRequests = ['가네키 켄'];

const FriendRequestList = () => {
  const [isManaging, setIsManaging] = useState(false);
  const toggleManage = () => setIsManaging(v => !v);

  const onCancel = (name: string) => alert(`'${name}' 친구 신청 취소 (stub)`);
  const onReject = (name: string) => alert(`'${name}' 친구 신청 거절 (stub)`);
  const onAccept = (name: string) => alert(`'${name}' 친구 추가 (stub)`);

  return (
    <ListWrapper>
      {/* 내가 보낸 친구 신청 */}
      <Section>
        <SectionHeader>
          <SectionTitle>내가 보낸 친구 신청</SectionTitle>
          <ManageButton onClick={toggleManage}>
            {isManaging ? '친구 신청 목록 저장' : '친구 신청 목록 관리'}
          </ManageButton>
        </SectionHeader>

        {sentRequests.map((name) => (
          <FriendItem
            key={name}
            name={name}
            showCancelButton={isManaging}
            onCancel={onCancel}
          />
        ))}
      </Section>

      {/* 내가 받은 친구 신청 */}
      <Section>
        <SectionTitle>내가 받은 친구 신청</SectionTitle>
        {receivedRequests.map((name) => (
          <FriendItem
            key={name}
            name={name}
            showAddButton
            onAdd={onAccept}
            showRejectButton={isManaging}
            onReject={onReject}
          />
        ))}
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