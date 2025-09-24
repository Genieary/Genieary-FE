// src/pages/CalendarPage.tsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import CalendarHeader from '../components/Calender/CalendarHeader';
import CalendarGrid from '../components/Calender/CalendarGrid';
import Holidays from '../components/Sidebar/Holidays';
import Summary from '../components/Sidebar/Summary';
import UpcomingEvents from '../components/Sidebar/UpcomingEvents'; // 원하면 이쪽도 pinned 쓰도록 수정 가능
import DiaryDetailPage from './DiaryDetailPage';
import { CalendarProvider, useCalendar } from '../store/calendarStore';

const CalendarPageInner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDiaryDetail, setShowDiaryDetail] = useState(false);
  const { groupEventsByDate } = useCalendar();

  const eventsByDate = useMemo(() => groupEventsByDate(), [groupEventsByDate]);

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDiaryDetail(true);
  };

  if (showDiaryDetail && selectedDate) {
    return <DiaryDetailPage selectedDate={selectedDate} onBack={() => setShowDiaryDetail(false)} />;
  }

  return (
    <Wrapper>
      <Sidebar>
        <Holidays currentDate={currentDate} />
        <Summary />
        {/* <UpcomingEvents /> 원하면 여기서도 pinned/다가올 일정만 보여주기 */}
      </Sidebar>
      <Main>
        <CalendarGridWrapper>
          <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
          <CalendarGrid currentDate={currentDate} onDateClick={handleDateClick} eventsByDate={eventsByDate} />
        </CalendarGridWrapper>
      </Main>
    </Wrapper>
  );
};

const CalendarPage = () => (
  <CalendarProvider>
    <CalendarPageInner />
  </CalendarProvider>
);

export default CalendarPage;

// styled-components (기존과 동일)
const Wrapper = styled.div`display: flex; gap: 24px; padding: 32px;`;
const Sidebar = styled.div`width: 240px; display: flex; flex-direction: column; gap: 20px;`;
const Main = styled.div`flex: 1; display: flex; flex-direction: column; gap: 16px;`;
const CalendarGridWrapper = styled.div`
  background-color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 10px; border-radius: 16px;
`;
