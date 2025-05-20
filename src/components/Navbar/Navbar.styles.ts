import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 40px;
  border-bottom: 1px solid #ccc;
  background-color: white;
`;

export const Logo = styled(Link)`
  font-weight: bold;
  font-size: 24px;
  text-decoration: none;
  color: black;
  cursor: pointer;
`;

export const NavCenter = styled.div`
  display: flex;
  gap: 150px;
`;

export const NavItem = styled(Link)<{ $active: boolean }>`
  position: relative;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: black;
  text-decoration: none;
`;

export const Underline = styled.div`
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 3px;
  background-color: royalblue;
`;

export const NavRight = styled(Link)`
  color: black;
`;