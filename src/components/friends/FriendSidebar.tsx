import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const menuItems = [
  { name: '친구 찾기', path: '/friends/find' },
  { name: '친구 목록', path: '/friends' },
  { name: '채팅', path: '/friends/chat' },
  { name: '친구 신청', path: '/friends/requests' },
];

const FriendSidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      {menuItems.map(({ name, path }) => {
         const isActive = (() => {
          if (name === '친구 목록') {
            return location.pathname === '/friends' || location.pathname.startsWith('/friend-profile');
          }
          if (name === '채팅') {
            return location.pathname.startsWith('/friends/chat');
          }
          return (
            location.pathname === path ||
            location.pathname.startsWith(path + '/')
          );
        })();

        return (
          <MenuItem key={name} to={path} $active={isActive}>
            {name}
          </MenuItem>
        );
      })}
    </SidebarContainer>
  );
};

export default FriendSidebar;

const SidebarContainer = styled.div`
  width: 180px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  height: auto;
  flex-shrink: 0; 
`;

const MenuItem = styled(Link)<{ $active: boolean }>`
  font-size: 16px;
  color: ${({ $active }) => ($active ? 'royalblue' : '#333')};
  font-weight: ${({ $active }) => ($active ? '700' : '600')};
  text-decoration: none;
  transition: color 0.2s;
  text-align: center;
  width: 100%;
`;
