// types/calendar.d.ts

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO 형식 예: '2025-05-31'
    color?: string; // 표시 색상 (선택)
    description?: string; // 상세 내용 (선택)
    isAllDay?: boolean;
  }
  
  export interface CalendarDayInfo {
    date: Date;
    isToday: boolean;
    isHoliday: boolean;
    events: CalendarEvent[];
  }