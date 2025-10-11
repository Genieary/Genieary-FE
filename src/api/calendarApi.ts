// src/api/calendarApi.ts
import api from './axiosInstance';

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  pageInfo?: any;
};
// ✅ 특정 날짜의 일정 조회 (기존 events와 별개)
export const getSchedulesByDate = async (date: string) => {
  const res = await api.get<ApiResponse<any>>(`/schedule`, { params: { date } });
  return res.data.result; // ex) [{ scheduleId, name, date, isEvent }]
};

// ✅ 월별 이벤트 조회 API (추가)
export const getMonthlyEvents = async (year: number, month: number) => {
  const res = await api.get<ApiResponse<any>>(`/schedule/events`, {
    params: { year, month },
  });
  return res.data.result;
};
// 한 달 요약 조회: GET /api/calendar/summary/{calendarId}
export const getMonthlySummary = async (calendarId: number) => {
  const res = await api.get<ApiResponse<string>>(`/calendar/summary/${calendarId}`);
  return res.data.result; // ✅ 요약 문자열만 반환
};
