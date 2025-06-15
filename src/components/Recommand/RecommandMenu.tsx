import React from "react";
import styled from "styled-components";

export const leftTabs = [
  { key: "basic", label: "기본 추천" },
  { key: "anniversary", label: "기념일 추천" },
  { key: "friend", label: "친구 맞춤 선물 추천" },
] as const;

export type LeftTabKey = typeof leftTabs[number]["key"];

const LeftMenu = styled.nav`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  margin-left:35px;
  margin-right:110px;
`;

const MenuCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 24px 10px 24px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 210px;
  position: relative;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuListItem = styled.li<{selected?: boolean}>`
  padding: 12px 32px;
  margin-bottom: 2px;
  border-radius: 8px;
  background: ${({selected}) => selected ? "#fff" : "none"};
  color: ${({selected}) => selected ? "#4A6CF6" : "#222"};
  font-weight: ${({ selected }) => (selected ? '700' : '600')};
  font-size: 16px;
  border-left: 4px solid transparent;
  cursor: pointer;
  text-align: center;
  transition: background 0.18s, color 0.18s, border-left 0.18s;
  &:hover {
    background: #f0f4ff;
    color: #4A6CF6;
  }
`;

interface Props {
  tab: LeftTabKey;
  setTab: (key: LeftTabKey) => void;
}

const RecommandMenu: React.FC<Props> = ({ tab, setTab }) => (
  <LeftMenu>
    <MenuCard>
      <MenuList>
        {leftTabs.map((item) => (
          <MenuListItem
            key={item.key}
            selected={tab === item.key}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </MenuListItem>
        ))}
      </MenuList>
    </MenuCard>
  </LeftMenu>
);

export default RecommandMenu;
