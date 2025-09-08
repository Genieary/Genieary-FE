// CalendarDay.tsx
import React from 'react';
import styled from 'styled-components';

export interface DayEvent {
  title: string;
  color: string;
}

interface CalendarDayProps {
  day?: number;                 // undefined면 빈칸
  isToday?: boolean;
  isHoliday?: boolean;
  isCurrentMonth?: boolean;
  events?: DayEvent[];
  onClick?: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isToday,
  isHoliday,
  isCurrentMonth,
  events = [],
  onClick,
}) => {
  return (
    <Wrapper isToday={isToday} isHoliday={isHoliday} onClick={onClick}>
      <DayNumber isCurrentMonth={isCurrentMonth}>{day ?? ''}</DayNumber>
      <Events>
        {events.map((event, idx) => (
          <Event key={idx} color={event.color} title={event.title}>
            {event.title}
          </Event>
        ))}
      </Events>
    </Wrapper>
  );
};

export default CalendarDay;

const Wrapper = styled.div<{ isToday?: boolean; isHoliday?: boolean }>`
  background-color: ${({ isToday }) => (isToday ? '#E0E6FF' : '#F8F9FA')};
  
  border-radius: 8px;
  padding: 6px 8px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ isToday }) => (isToday ? '#d4daff' : '#e9ecef')};
  }
`;

const DayNumber = styled.div<{ isCurrentMonth?: boolean }>`
  font-weight: 500;
  font-size: 14px;
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? '#000' : '#ccc')};
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
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
