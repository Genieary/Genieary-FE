// CalendarPage.tsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import CalendarHeader from '../components/Calender/CalendarHeader';
import CalendarGrid from '../components/Calender/CalendarGrid';
import Holidays from '../components/Sidebar/Holidays';
import Summary from '../components/Sidebar/Summary';
import UpcomingEvents from '../components/Sidebar/UpcomingEvents';
import DiaryDetailPage from './DiaryDetailPage';

type RawEvent = { date: string; title: string; color?: string }; // date는 'YYYY-MM-DD' 권장

// 유틸: Date → 'YYYY-MM-DD'
const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDiaryDetail, setShowDiaryDetail] = useState(false);

  // 1) 원본 이벤트를 페이지에서 관리
  // (예시로 고정 데이터. 실제론 서버/스토어에서 받아오면 됨)
  const year = currentDate.getFullYear(); // 올 해로 고정하여 키 만들기
  const holidaysRaw: RawEvent[] = [
    { date: `${year}-09-05`, title: '햄 생일', color: '#FFF3BF' },
    { date: `${year}-09-05`, title: '산책', color: '#FFE8E8' },
    { date: `${year}-09-08`, title: '아림이 집들이', color: '#D2F9D9' },
    { date: `${year}-09-30`, title: '종강 파티', color: '#FFF3BF' },
    { date: `${year}-08-30`, title: '수영장 파티', color: '#FFF3BF' },
    { date: `${year}-08-12`, title: '생일 파티', color: '#D2F9D9' },
  ];
  const upcomingRaw: RawEvent[] = [
    { date: `${year}-08-31`, title: 'Project deadline', color: '#E6F0FF' },
    { date: `${year}-10-02`, title: 'Team offsite', color: '#E6F0FF' },
    { date: `${year}-10-05`, title: 'Friend birthday 🎂', color: '#E6F0FF' },
  ];

  // 2) 휴일 세트(테두리 강조용) + 날짜별 이벤트 맵
  const holidaysSet = useMemo(() => new Set(holidaysRaw.map(e => e.date)), [holidaysRaw]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, { title: string; color: string }[]> = {};
    const all = [...holidaysRaw, ...upcomingRaw];
    all.forEach(({ date, title, color }) => {
      if (!map[date]) map[date] = [];
      map[date].push({ title, color: color ?? '#f4f8ff' });
    });
    return map;
  }, [holidaysRaw, upcomingRaw]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDiaryDetail(true);
  };

  const handleBackToCalendar = () => {
    setShowDiaryDetail(false);
    setSelectedDate(null);
  };

  if (showDiaryDetail && selectedDate) {
    return <DiaryDetailPage selectedDate={selectedDate} onBack={handleBackToCalendar} />;
  }

  // 사이드바에 보여줄 리스트용으로도 그대로 사용
  return (
    <Wrapper>
      <Sidebar>
       <Holidays items={holidaysRaw} currentDate={currentDate} />

        <Summary />
        {/* <UpcomingEvents items={upcomingRaw} /> */}
      </Sidebar>
      <Main>
        <CalendarGridWrapper>
          <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
          <CalendarGrid
            currentDate={currentDate}
            onDateClick={handleDateClick}
            eventsByDate={eventsByDate}
            holidaysSet={holidaysSet}
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
