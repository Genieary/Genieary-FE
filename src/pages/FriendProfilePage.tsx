import React from 'react';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import FriendProfileContent from '../components/friends/FriendProfileContent';

const FriendProfilePage = () => {
  return (
    <PageWrapper>
      <FriendSidebar />
      <FriendProfileContent />
    </PageWrapper>
  );
};

export default FriendProfilePage;

const PageWrapper = styled.div`
  display: flex;
  gap: 32px;
  padding: 32px;
  align-items: flex-start;
`;
