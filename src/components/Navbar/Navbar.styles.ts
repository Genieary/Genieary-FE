import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 140px;
  background-color: white;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
`;

export const Logo = styled(Link)`
  font-weight: bold;
  font-size: 24px;
  text-decoration: none;
  color: black;
  cursor: pointer;
  margin-top: 12px;
`;

export const NavCenter = styled.div`
  display: flex;
  justify-content: center;
  gap: 300px;
  width: fit-content;
  position: relative;
  z-index: 20;
  margin: 10px 0;
`;

export const NavItem = styled(Link)<{ $active: boolean }>`
  position: relative;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ $active }) => ($active ? 'royalblue' : 'black')};
  text-decoration: none;
  font-size: 16px;
  padding: 4px 12px;
  transition: color 0.2s ease;
`;


export const Underline = styled.div`
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 3px;
  background-color: royalblue;
  border-radius: 1px;
  transform: scaleX(5);
  transform-origin: center;
`;


// 메뉴 위아래 선을 화면 끝까지 쭉
export const LinesWrapper = styled.div`
  position: absolute;
  top: 62px; /* NavCenter margin-top(24px) + NavCenter height 대략 맞춤 */
  left: 0;
  width: 100vw;
  pointer-events: none;
  z-index: 10; /* NavCenter보다 뒤에 있음 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 20px; /* NavbarContainer 좌우 패딩과 맞춤 */
  box-sizing: border-box;
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eee;
`;

export const NavRight = styled(Link)`
  position: absolute;
  top: 16px;
  right: 40px;
  color: black;
  display: flex;
  align-items: center;
`;

export const TopLineWrapper = styled.div`
  position: absolute;
  top: 80px;  /* NavCenter 바로 위에, 적당히 띄움 */
  left: 0;
  width: 100vw;
  padding: 0 20px;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 10;
`;

export const BottomLineWrapper = styled.div`
  position: absolute;
  top: 120px; /* NavCenter 바로 아래에, 적당히 띄움 */
  left: 0;
  width: 100vw;
  padding: 0 20px;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 10;
`;