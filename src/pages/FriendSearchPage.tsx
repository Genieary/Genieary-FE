import React from 'react';
import styled from 'styled-components';
import FriendSidebar from '../components/friends/FriendSidebar';
import FriendSearch from '../components/friends/FriendSearch';

const FriendSearchPage = () => {
  return (
    <Layout>
      <FriendSidebar />
      <Main>
        <FriendSearch />
      </Main>
    </Layout>
  );
};

export default FriendSearchPage;

const Layout = styled.div`
  display: flex;
  gap: 32px;
  padding: 32px;
  align-items: flex-start;
`;

const Main = styled.div`
  flex: 1;
`;