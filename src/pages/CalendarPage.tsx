import React, { useState } from 'react';
import styled from 'styled-components';
import CalendarHeader from '../components/Calender/CalendarHeader';
import CalendarGrid from '../components/Calender/CalendarGrid';
import Holidays from '../components/Sidebar/Holidays';
import Summary from '../components/Sidebar/Summary';
import UpcomingEvents from '../components/Sidebar/UpcomingEvents';
import DiaryDetailPage from './DiaryDetailPage';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDiaryDetail, setShowDiaryDetail] = useState(false);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDiaryDetail(true);
  };

  // 일기 페이지에서 뒤로가기
  const handleBackToCalendar = () => {
    setShowDiaryDetail(false);
    setSelectedDate(null);
  };

  // 일기 작성 페이지를 보여줄지 캘린더를 보여줄지 결정
  if (showDiaryDetail && selectedDate) {
    return (
      <DiaryDetailPage 
        selectedDate={selectedDate} 
        onBack={handleBackToCalendar}
      />
    );
  }

  return (
    <Wrapper>
      <Sidebar>
        <Holidays />
        <Summary />
        <UpcomingEvents />
      </Sidebar>
      <Main>
        <CalendarGridWrapper>
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          
          <CalendarGrid 
            currentDate={currentDate} 
            onDateClick={handleDateClick}
          />
        </CalendarGridWrapper>
      </Main>
    </Wrapper>
  );
};

export default CalendarPage;

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  padding: 32px;
`;

const Sidebar = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CalendarGridWrapper = styled.div`
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
  border-radius: 16px;
`;