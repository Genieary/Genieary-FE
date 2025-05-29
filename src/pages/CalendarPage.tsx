import React, { useState } from 'react';
import styled from 'styled-components';
import CalendarHeader from '../components/Calender/CalendarHeader';
import CalendarGrid from '../components/Calender/CalendarGrid';
import Holidays from '../components/Sidebar/Holidays';
import Summary from '../components/Sidebar/Summary';
import UpcomingEvents from '../components/Sidebar/UpcomingEvents';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

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
        
          <CalendarGrid currentDate={currentDate} />
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
