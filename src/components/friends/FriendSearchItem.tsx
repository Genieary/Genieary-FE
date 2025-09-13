import React from 'react';
import styled from 'styled-components';

type Props = {
  name: string;
  onAdd?: (name: string) => void;
};

const FriendSearchItem = ({ name, onAdd }: Props) => {
  return (
    <Row>
      <Avatar />
      <Content>
        <Name>{name}</Name>
      </Content>

      <ButtonWrap>
        <AddButton onClick={() => onAdd?.(name)}>
          친구 추가 <AddIcon />
        </AddButton>
      </ButtonWrap>
    </Row>
  );
};

export default FriendSearchItem;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff3bf;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  padding-left: 16px;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #d2f9d9;
  border: 1.5px solid #2b8a3e;
  color: #2b8a3e;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.333 16.5V14.8333C13.333 13.9493 12.9818 13.1014 12.3567 12.4763C11.7316 11.8512 10.8837 11.5 9.99967 11.5H4.16634C3.28229 11.5 2.43444 11.8512 1.80932 12.4763C1.1842 13.1014 0.833008 13.9493 0.833008 14.8333V16.5M16.6663 5.66667V10.6667M19.1663 8.16667H14.1663M10.4163 4.83333C10.4163 6.67428 8.92396 8.16667 7.08301 8.16667C5.24206 8.16667 3.74967 6.67428 3.74967 4.83333C3.74967 2.99238 5.24206 1.5 7.08301 1.5C8.92396 1.5 10.4163 2.99238 10.4163 4.83333Z"
      stroke="#2B8A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);
