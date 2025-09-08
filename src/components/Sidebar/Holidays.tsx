import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface HolidayItem {
  date: string;   // 권장: 'YYYY-MM-DD'
  title?: string;
  name?: string;
}

interface HolidaysProps {
  items?: HolidayItem[];    // 전체 이벤트 배열(여러 달 섞여 있어도 OK)
  currentDate: Date;        // 여기 기준으로 "이번 달"만 보여줌
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const monthKeyOf = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

const Holidays: React.FC<HolidaysProps> = ({ items = [], currentDate }) => {
  const monthKey = monthKeyOf(currentDate);

  // 이번 달만 필터
  const monthItems = useMemo(
    () => items.filter((it) => typeof it.date === 'string' && it.date.startsWith(monthKey)),
    [items, monthKey]
  );

  return (
    <Box>
      <Title>이번 달 이벤트</Title>
      {monthItems.length === 0 ? (
        <Empty>이번 달 등록된 이벤트가 없어요.</Empty>
      ) : (
        <List>
          {monthItems.map((h, i) => (
            <Item key={i}>
              <DateText>{h.date.slice(5)}</DateText> {h.name ?? h.title}
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
const Title = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;
const Empty = styled.div`
  color: #999;
  font-size: 13px;
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
