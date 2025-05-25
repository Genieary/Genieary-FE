import React from 'react';
import FriendSidebar from '../components/friends/FriendSidebar';
import FriendList from '../components/friends/FriendList';

const FriendsPage = () => {
  return (
    <div style={{ display: 'flex', gap: '32px', padding: '32px', alignItems: 'flex-start' }}>
      <FriendSidebar />
      <FriendList />
    </div>
  );
};

export default FriendsPage;
