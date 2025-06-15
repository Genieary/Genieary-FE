import React from 'react';
import styled from 'styled-components';

interface CalendarGridProps {
  currentDate: Date;
  onDateClick?: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, onDateClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 이번 달의 첫 번째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 이번 달의 첫 번째 날이 무슨 요일인지 (0: 일요일, 1: 월요일, ...)
  const firstDayOfWeek = firstDay.getDay();
  
  // 이번 달의 총 일수
  const daysInMonth = lastDay.getDate();
  
  // 이전 달의 마지막 날
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // 다음 달의 첫 번째 날들
  const nextMonthDays = 42 - (firstDayOfWeek + daysInMonth); // 6주 * 7일 = 42일
  
  const days = [];
  
  // 이전 달의 날짜들 (회색으로 표시)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push(
      <DateCell 
        key={`prev-${prevMonthLastDay - i}`} 
        isOtherMonth
        onClick={() => onDateClick && onDateClick(date)}
      >
        {prevMonthLastDay - i}
      </DateCell>
    );
  }
  
  // 이번 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = 
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();
    
    days.push(
      <DateCell 
        key={day} 
        isToday={isToday}
        onClick={() => onDateClick && onDateClick(date)}
      >
        {day}
      </DateCell>
    );
  }
  
  // 다음 달의 날짜들 (회색으로 표시)
  for (let day = 1; day <= nextMonthDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push(
      <DateCell 
        key={`next-${day}`} 
        isOtherMonth
        onClick={() => onDateClick && onDateClick(date)}
      >
        {day}
      </DateCell>
    );
  }

  return (
    <Grid>
      <WeekHeader>
        <WeekDay>Sun</WeekDay>
        <WeekDay>Mon</WeekDay>
        <WeekDay>Tue</WeekDay>
        <WeekDay>Wed</WeekDay>
        <WeekDay>Thu</WeekDay>
        <WeekDay>Fri</WeekDay>
        <WeekDay>Sat</WeekDay>
      </WeekHeader>
      <DatesGrid>
        {days}
      </DatesGrid>
    </Grid>
  );
};

export default CalendarGrid;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
`;

const WeekDay = styled.div`
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 14px;
`;

const DatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DateCell = styled.div<{ isToday?: boolean; isOtherMonth?: boolean }>`
  padding: 8px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-height: 80px;
  background-color: #F8F9FA;
  
  
  ${props => props.isToday && `
    background-color: #E0E6FF;
    font-weight: 600;
  `}
  
  ${props => props.isOtherMonth && `
    color: #ccc;
    // background-color: #f1f3f4;
  `}
  
  &:hover {
    background-color: ${props => props.isToday ? '#d4daff' : '#e9ecef'};
  }
`;