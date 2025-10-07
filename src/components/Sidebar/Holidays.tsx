// src/components/Sidebar/Holidays.tsx
import React from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../store/calendarStore';

interface HolidaysProps {
  currentDate: Date; // 이 달만 보여준다
}

const Holidays: React.FC<HolidaysProps> = ({ currentDate }) => {
  const { pinnedForMonth } = useCalendar();
  const items = pinnedForMonth(currentDate); // pinned=true만

  return (
    <Box>
      <Title>이벤트</Title>
      {items.length === 0 ? (
        <Empty>이번 달 등록된 이벤트가 없어요.</Empty>
      ) : (
        <List>
          {items.map((h) => (
            <Item key={h.id}>
              <DateText>{h.date.slice(5)}</DateText> {h.title}
            </Item>
          ))}
        </List>
      )}
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
const Title = styled.div`font-weight: bold; margin-bottom: 8px;`;
const Empty = styled.div`color: #999; font-size: 13px;`;
const List = styled.ul`list-style: none; padding: 0; margin: 0;`;
const Item = styled.li`margin-bottom: 6px;`;
const DateText = styled.span`color: #FF993C; font-weight: 600;`;
