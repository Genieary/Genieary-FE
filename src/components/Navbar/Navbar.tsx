import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserIcon from '../Icons/UserIcon';
import {
  NavbarContainer,
  Logo,
  NavCenter,
  NavRight,
  NavItem,
  Underline,
  TopLineWrapper,
  BottomLineWrapper,
  Line
} from './Navbar.styles';

const navItems = [
  { name: '추천', path: '/recommend' },
  { name: '캘린더', path: '/calendar' },
  { name: '친구', path: '/friends' },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <NavbarContainer>
      <Logo to="/">
        <img src="/images/logo.png" alt="logo" style={{ height: '60px' }} />
      </Logo>

      <TopLineWrapper>
        <Line />
      </TopLineWrapper>

      <NavCenter>
        {navItems.map(({ name, path }) => (
          <NavItem key={name} to={path} $active={location.pathname === path}>
            {name}
            {location.pathname === path && <Underline />}
          </NavItem>
        ))}
      </NavCenter>

      <BottomLineWrapper>
        <Line />
      </BottomLineWrapper>

      <NavRight to="/mypage">
        <UserIcon size={28} />
      </NavRight>
    </NavbarContainer>
  );
};

export default Navbar;
