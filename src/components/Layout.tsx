import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <NavBar>
        <Logo>MyCalendar</Logo>
        <Menu>
          <MenuItem>추천기능</MenuItem>
          <MenuItem>캘린더</MenuItem>
          <MenuItem>친구</MenuItem>
        </Menu>
        <ProfileIcon>
          <img src="/user-icon.png" alt="Profile" width={24} height={24} />
        </ProfileIcon>
      </NavBar>
      <Content>{children}</Content>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Menu = styled.div`
  display: flex;
  gap: 20px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  font-size: 14px;
`;

const ProfileIcon = styled.div`
  cursor: pointer;
`; 

const Content = styled.main`
  flex: 1;
  background-color: #f9f9f9;
  overflow-y: auto;
`;
