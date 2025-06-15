import React from 'react';
import styled from 'styled-components';

interface CalendarDayProps {
  day?: number; // undefined인 경우 공백 칸
  isToday?: boolean;
  isHoliday?: boolean;
  isCurrentMonth?: boolean;
  events?: { title: string; color: string }[];
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isToday, isHoliday, isCurrentMonth, events = [] }) => {
  return (
    <Wrapper isToday={isToday} isHoliday={isHoliday}>
      <DayNumber isCurrentMonth={isCurrentMonth}>{day}</DayNumber>
      {events.map((event, idx) => (
        <Event key={idx} color={event.color}>{event.title}</Event>
      ))}
    </Wrapper>
  );
};

export default CalendarDay;

const Wrapper = styled.div<{
  isToday?: boolean;
  isHoliday?: boolean;
}>`
  background-color: ${({ isToday }) => (isToday ? '#E0E6FF' : '#F8F9FA')};
  border: ${({ isHoliday }) => (isHoliday ? '1.5px solid #ff6b6b' : '1px solidrgb(255, 255, 255)')};
  border-radius: 8px;
  padding: 6px 8px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DayNumber = styled.div<{ isCurrentMonth?: boolean }>`
  font-weight: 500;
  font-size: 14px;
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? '#000' : '#ccc')};
`;

const Event = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  color: #000;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;