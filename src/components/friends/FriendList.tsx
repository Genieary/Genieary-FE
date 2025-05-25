 import React from 'react';
import FriendItem from './FriendItem';
import styled from 'styled-components';

const friends = ['정원쨩', '권아림', '아리무', '도카쨩'];
const recommendedFriends = ['가네키 켄'];

const FriendList = () => {
  return (
    <ListWrapper>
      <Section>
        <SectionHeader>
            <SectionTitle>친구</SectionTitle>
            <ManageButton>친구 목록 관리</ManageButton>
        </SectionHeader>
        {friends.map((friend) => (
          <FriendItem key={friend} name={friend} />
        ))}
      </Section>

      <Section>
        <SectionTitle>추천 친구</SectionTitle>
        {recommendedFriends.map((friend) => (
            <FriendItem name={friend} showAddButton />
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
`;