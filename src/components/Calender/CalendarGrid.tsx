import React from 'react';
import styled from 'styled-components';
import CalendarDay from './CalendarDay';

interface Props {
  currentDate: Date;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid: React.FC<Props> = ({ currentDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const prevMonthEnd = new Date(year, month, 0).getDate();

  const totalCells = 42; // 항상 35칸
  const calendarDays: { day: number; isCurrentMonth: boolean }[] = [];

  // 1. 이전 달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthEnd - i, isCurrentMonth: false });
  }

  // 2. 이번 달 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }

  // 3. 다음 달 날짜
  const nextDays = totalCells - calendarDays.length;
  for (let i = 1; i <= nextDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  return (
    <Grid>
      {daysOfWeek.map(day => (
        <DayHeader key={day}>{day}</DayHeader>
      ))}
      {calendarDays.map((date, idx) => (
        <CalendarDay
          key={idx}
          day={date.day}
          isCurrentMonth={date.isCurrentMonth}
        />
      ))}
    </Grid>
  );
};

export default CalendarGrid;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const DayHeader = styled.div`
  font-weight: bold;
  text-align: center;
`;
