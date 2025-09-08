// CalendarGrid.tsx
import React from 'react';
import styled from 'styled-components';
import CalendarDay, { DayEvent } from './CalendarDay';

interface CalendarGridProps {
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  eventsByDate?: Record<string, DayEvent[]>; // ← 추가
  holidaysSet?: Set<string>;                 // 선택: 휴일 강조 (키: YYYY-MM-DD)
}

const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, onDateClick, eventsByDate = {}, holidaysSet }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const nextMonthDays = 42 - (firstDayOfWeek + daysInMonth);

  const days: React.ReactNode[] = [];

  // 이전 달
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    const key = keyOf(date);
    days.push(
      <CalendarDay
        key={`prev-${prevMonthLastDay - i}`}
        day={prevMonthLastDay - i}
        isToday={isToday}
        isCurrentMonth={false}
        isHoliday={holidaysSet?.has(key)}
        events={eventsByDate[key] ?? []}
        onClick={() => onDateClick?.(date)}
      />
    );
  }

  // 이번 달
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    const key = keyOf(date);
    days.push(
      <CalendarDay
        key={day}
        day={day}
        isToday={isToday}
        isCurrentMonth={true}
        isHoliday={holidaysSet?.has(key)}
        events={eventsByDate[key] ?? []}
        onClick={() => onDateClick?.(date)}
      />
    );
  }

  // 다음 달
  for (let day = 1; day <= nextMonthDays; day++) {
    const date = new Date(year, month + 1, day);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    const key = keyOf(date);
    days.push(
      <CalendarDay
        key={`next-${day}`}
        day={day}
        isToday={isToday}
        isCurrentMonth={false}
        isHoliday={holidaysSet?.has(key)}
        events={eventsByDate[key] ?? []}
        onClick={() => onDateClick?.(date)}
      />
    );
  }

  return (
    <Grid>
      <WeekHeader>
        <WeekDay style={{ color: '#d9534f' }}>Sun</WeekDay>
        <WeekDay>Mon</WeekDay>
        <WeekDay>Tue</WeekDay>
        <WeekDay>Wed</WeekDay>
        <WeekDay>Thu</WeekDay>
        <WeekDay>Fri</WeekDay>
        <WeekDay>Sat</WeekDay>
      </WeekHeader>
      <DatesGrid>{days}</DatesGrid>
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
