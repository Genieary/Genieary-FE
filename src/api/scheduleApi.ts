import api from './axiosInstance';

// ✅ 모든 API 공통 응답 타입
type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  pageInfo?: {
    page: number;
    size: number;
    hasNext: boolean;
    totalElements: number;
    totalPages: number;
  } | null;
  result: T;
};

/**
 * ✅ 일정 조회 (GET /api/schedule?date=YYYY-MM-DD)
 * 특정 날짜의 일정을 조회합니다.
 */
export const getSchedulesByDate = async (date: string) => {
  const res = await api.get<ApiResponse<any>>(`/schedule`, { params: { date } });
  return res.data.result; // 응답에서 result만 추출
};

/**
 * ✅ 일정 추가 (POST /api/schedule)
 * 새로운 일정을 생성합니다.
 */
export const createSchedule = async (data: {
  calendarId: number;
  name: string;
  isEvent: boolean;
  date: string;
}) => {
  const res = await api.post<ApiResponse<any>>(`/schedule`, data);
  return res.data.result;
};

/**
 * ✅ 일정 수정 (PATCH /api/schedule/{scheduleId})
 * 이름, 날짜, 이벤트 여부 중 원하는 항목만 수정합니다.
 */
export const updateSchedule = async (
  scheduleId: number,
  data: { name?: string; isEvent?: boolean; date?: string }
) => {
  const res = await api.patch<ApiResponse<any>>(`/schedule/${scheduleId}`, data);
  return res.data.result;
};

/**
 * ✅ 일정 삭제 (DELETE /api/schedule/{scheduleId})
 */
export const deleteSchedule = async (scheduleId: number) => {
  const res = await api.delete<ApiResponse<any>>(`/schedule/${scheduleId}`);
  return res.data.result;
};

/**
 * ✅ 월별 이벤트 조회 (GET /api/schedule/events?year=YYYY&month=MM)
 */
export const getMonthlyEvents = async (year: number, month: number) => {
  const res = await api.get<ApiResponse<any>>(`/schedule/events`, {
    params: { year, month },
  });
  return res.data.result;
};
