import React from 'react';
import styled from 'styled-components';

const holidays = [
  { date: 'May 5', name: '어린이 생일' },
  { date: 'May 8', name: "아림이 집들이" },
  { date: 'May 30', name: '종강 파티' },
];

const Holidays: React.FC = () => {
  return (
    <Box>
      <Title>이번 달 이벤트</Title>
      <List>
        {holidays.map((holiday, index) => (
          <Item key={index}>
            <DateText>{holiday.date}</DateText> {holiday.name}
          </Item>
        ))}
      </List>
    </Box>
  );
};

export default Holidays;

const Box = styled.div`
  background-color: #FEF9E7;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  margin-bottom: 4px;
`;

const DateText = styled.span`
  color: #FF993C;
  font-weight: 600;
`;