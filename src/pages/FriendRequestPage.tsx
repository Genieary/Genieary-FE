import React from 'react';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import FriendRequestList from '../components/friends/FriendRequestList';

const FriendRequestPage = () => {
  return (
    <Layout>
      <FriendSidebar />
      <Main>
        <FriendRequestList />
      </Main>
    </Layout>
  );
};

export default FriendRequestPage;

const Layout = styled.div`
  display: flex;
  gap: 32px;
  padding: 32px;
  align-items: flex-start;
`;

const Main = styled.div`
  flex: 1;
`;