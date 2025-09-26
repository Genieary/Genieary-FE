import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const menuItems = [
  { name: '내 정보', path: '/mypage/info' },
  { name: '저장된 선물', path: '/mypage/gifts' },
  { name: '저장된 하루', path: '/mypage/days' },
];

const MyPageSidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      {menuItems.map(({ name, path }) => {
        const isActive = (() => {
          // ✅ "내 정보"는 info/password-check/edit 전부 활성화
          if (name === '내 정보') {
            return (
              location.pathname === '/mypage/info' ||
              location.pathname.startsWith('/mypage/password-check') ||
              location.pathname.startsWith('/mypage/edit')
            );
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

export default MyPageSidebar;

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
  height: 105px;
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
