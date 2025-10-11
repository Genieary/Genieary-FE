import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import CalendarHeader from '../components/Calender/CalendarHeader';
import CalendarGrid from '../components/Calender/CalendarGrid';
import Holidays from '../components/Sidebar/Holidays';
import Summary from '../components/Sidebar/Summary';
import DiaryDetailPage from './DiaryDetailPage';
import { CalendarProvider, useCalendar } from '../store/calendarStore';
import { getSchedulesByDate, getMonthlyEvents } from '../api/scheduleApi';
import { getMonthlySummary } from '../api/calendarApi';

const CalendarPageInner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDiaryDetail, setShowDiaryDetail] = useState(false);

  // ✅ API 데이터 상태
  const [schedules, setSchedules] = useState<any[]>([]);
  const [summaryText, setSummaryText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { groupEventsByDate } = useCalendar();

  // ✅ month 단위로 API 호출 (이 달 이벤트 + 요약)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        // 1번 calendarId는 예시 (로그인 후 교체)
        const [monthlyEvents, summary] = await Promise.all([
          getMonthlyEvents(year, month),
          getMonthlySummary(1),
        ]);

        setSchedules(monthlyEvents);   // 월별 일정
        setSummaryText(summary);       // 한 달 요약
      } catch (err) {
        console.error('캘린더 데이터 불러오기 실패:', err);
        setSummaryText('요약을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);

  // ✅ store에 그룹핑 로직 있으면 그대로 유지
const eventsByDate = useMemo(() => groupEventsByDate(), [groupEventsByDate, schedules]);


  // ✅ 날짜 클릭 시 — 해당 날짜 일정 조회
  const handleDateClick = async (date: Date) => {
  // 1️⃣ 먼저 바로 화면 전환
  setSelectedDate(date);
  setShowDiaryDetail(true);

  // 2️⃣ 이후 비동기로 일정 불러오기 (콘솔 출력용)
  try {
    const formatted = date.toISOString().split('T')[0];
    const daySchedules = await getSchedulesByDate(formatted);
    console.log('📅 선택한 날짜의 일정:', daySchedules);
  } catch (err) {
    console.error('선택 날짜 일정 조회 실패:', err);
  }
};


  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  if (showDiaryDetail && selectedDate) {
    return (
      <DiaryDetailPage
        selectedDate={selectedDate}
        onBack={() => setShowDiaryDetail(false)}
      />
    );
  }

  return (
    <Wrapper>
      <Sidebar>
        <Holidays currentDate={currentDate} />
        <Summary summaryText={summaryText} loading={loading} />
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
            eventsByDate={eventsByDate}
          />
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
  background-color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 10px;
  border-radius: 16px;
`;
