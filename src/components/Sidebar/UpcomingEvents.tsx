import React from 'react';
import styled from 'styled-components';

interface EventItem {
  date: string;  // YYYY-MM-DD
  title: string;
}

interface UpcomingEventsProps {
  items: EventItem[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ items }) => {
  return (
    <Box>
      <Title>Upcoming Events</Title>
      <List>
        {items.map((ev, i) => (
          <ItemLi key={i}>
            <DateText>{ev.date.slice(5)}</DateText> {ev.title}
          </ItemLi>
        ))}
      </List>
    </Box>
  );
};

export default UpcomingEvents;

const Box = styled.div`
  background-color: #f4f8ff;
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
const ItemLi = styled.li`
  margin-bottom: 4px;
`;
const DateText = styled.span`
  color: #4285f4;
  font-weight: 600;
`;
