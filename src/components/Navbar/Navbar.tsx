import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import {
  NavbarContainer,
  Logo,
  NavCenter,
  NavRight,
  NavItem,
  Underline
} from './Navbar.styles';

const navItems = [
  { name: '추천', path: '/recommend' },
  { name: '캘린더', path: '/calendar' },
  { name: '친구', path: '/friends' },
];

const Navbar = () => {
  const location = useLocation();
  const UserIcon = FaUser as unknown as React.FC<{ size?: number }>;

  return (
    <NavbarContainer>
      <Logo to="/">LOGO</Logo>

      <NavCenter>
        {navItems.map(({ name, path }) => (
          <NavItem key={name} to={path} $active={location.pathname === path}>
            {name}
            {location.pathname === path && <Underline />}
          </NavItem>
        ))}
      </NavCenter>

      <NavRight to="/mypage">
        <UserIcon size={20} />
      </NavRight>
    </NavbarContainer>
  );
};

export default Navbar;
