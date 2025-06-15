import React from 'react';
import styled from 'styled-components';

const upcomingEvents = [
  { date: 'May 31', title: 'Project deadline' },
  { date: 'Jun 2', title: 'Team offsite' },
  { date: 'Jun 5', title: 'Friend birthday 🎂' },
];

const UpcomingEvents: React.FC = () => {
  return (
    <Box>
      <Title>Upcoming Events</Title>
      <List>
        {upcomingEvents.map((event, index) => (
          <Item key={index}>
            <DateText>{event.date}</DateText> {event.title}
          </Item>
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

const Item = styled.li`
  margin-bottom: 4px;
`;

const DateText = styled.span`
  color: #4285f4;
  font-weight: 600;
`;