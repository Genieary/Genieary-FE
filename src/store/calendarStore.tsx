// src/store/calendarStore.tsx
import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { getMonthlyEvents, getSchedulesByDate } from '../api/calendarApi'; // ✅ 일정도 추가

/** ---------- 타입 정의 ---------- */
export type Gift = {
  id: string;
  title: string;
  imageUrl: string;
};

export type EventItem = {
  id: string;
  date: string;          // YYYY-MM-DD
  title: string;
  color?: string;
  pinned?: boolean;      // true면 사이드바 "이번 달 이벤트"에 노출
};

export type Diary = {
  diaryId?: number;      // ✅ 백엔드 ID (optional)
  content: string;
  createdAt?: string;
  isLiked?: boolean;
  diaryDate?: string;    // YYYY-MM-DD
};

export type PhotoAnalysis = {
  date: string;
  imageDataUrl?: string;
  summary?: string;
  stats?: { sunny: number; cloudy: number; rainy: number };
};

/** ---------- 상태 정의 ---------- */
type State = {
  events: EventItem[];
  diaries: Record<string, Diary>;
  photoAnalyses: Record<string, PhotoAnalysis>;
  gifts: Record<string, Gift[]>;
};

/** ---------- 액션 정의 ---------- */
type Action =
  | { type: 'SET_EVENTS'; payload: EventItem[] }
  | { type: 'ADD_EVENT'; payload: EventItem }
  | { type: 'UPDATE_EVENT'; payload: { id: string; patch: Partial<EventItem> } }
  | { type: 'DELETE_EVENT'; payload: { id: string } }
  | { type: 'SET_DIARY'; payload: Diary }
  | { type: 'DELETE_DIARY'; payload: { date: string } }
  | { type: 'SET_PHOTO'; payload: PhotoAnalysis }
  | { type: 'CLEAR_PHOTO'; payload: { date: string } }
  | { type: 'SET_GIFTS'; payload: { date: string; gifts: Gift[] } };

/** ---------- 유틸 ---------- */
const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const monthKeyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/** ---------- 리듀서 ---------- */
const reducer = (s: State, a: Action): State => {
  switch (a.type) {
    case 'SET_EVENTS':
      return { ...s, events: a.payload };
    case 'ADD_EVENT':
      return { ...s, events: [...s.events, a.payload] };
    case 'UPDATE_EVENT':
      return {
        ...s,
        events: s.events.map(e => (e.id === a.payload.id ? { ...e, ...a.payload.patch } : e)),
      };
    case 'DELETE_EVENT':
      return { ...s, events: s.events.filter(e => e.id !== a.payload.id) };

    case 'SET_DIARY': {
      const dateKey = a.payload.diaryDate ?? '';
      if (!dateKey) return s;
      return { ...s, diaries: { ...s.diaries, [dateKey]: a.payload } };
    }

    case 'DELETE_DIARY': {
      const next = { ...s.diaries };
      delete next[a.payload.date];
      return { ...s, diaries: next };
    }

    case 'SET_PHOTO':
      return { ...s, photoAnalyses: { ...s.photoAnalyses, [a.payload.date]: a.payload } };

    case 'CLEAR_PHOTO': {
      const next = { ...s.photoAnalyses };
      delete next[a.payload.date];
      return { ...s, photoAnalyses: next };
    }

    case 'SET_GIFTS':
      return { ...s, gifts: { ...s.gifts, [a.payload.date]: a.payload.gifts } };

    default:
      return s;
  }
};

/** ---------- 컨텍스트 타입 ---------- */
type Ctx = {
  state: State;
  addEvent: (date: string, title: string, color?: string) => string;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  togglePinned: (id: string) => void;
  eventsByDate: (date: string) => EventItem[];
  groupEventsByDate: () => Record<string, EventItem[]>;
  pinnedForMonth: (d: Date) => EventItem[];

  setDiary: (date: string, diary: Diary) => void;
  getDiary: (date: string) => Diary | undefined;
  deleteDiary: (date: string) => void;

  setPhoto: (p: PhotoAnalysis) => void;
  getPhoto: (date: string) => PhotoAnalysis | undefined;
  clearPhoto: (date: string) => void;

  setGifts: (date: string, gifts: Gift[]) => void;
  getGifts: (date: string) => Gift[] | undefined;
};

/** ---------- Context ---------- */
const CalendarContext = createContext<Ctx | null>(null);

/** ---------- 초기 상태 ---------- */
const initialState: State = {
  events: [],
  diaries: {},
  photoAnalyses: {},
  gifts: {},
};

/** ---------- Provider 구현 ---------- */
export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** ✅ Provider가 처음 마운트될 때 서버에서 일정 불러오기 */
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const loadEventsAndSchedules = async () => {
      try {
        /** ✅ 1️⃣ 월별 이벤트 불러오기 */
        const eventsFromServer = await getMonthlyEvents(year, month);
        const mappedEvents = eventsFromServer.map((e: any) => ({
          id: `event-${e.scheduleId}`,
          date: e.date,
          title: e.name ?? e.title ?? '(제목 없음)',
          color: '#FFE3E2',
          pinned: e.isEvent ?? true,
        }));

        /** ✅ 2️⃣ 이번 달 전체 일정 불러오기 */
        // 이번 달의 모든 날짜에 대해 요청 (주의: 성능 최적화 필요)
        const daysInMonth = new Date(year, month, 0).getDate();
        const allSchedules: any[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          try {
            const schedules = await getSchedulesByDate(dateStr);
            if (schedules && schedules.length > 0) {
              schedules.forEach((s: any) =>
                allSchedules.push({
                  id: `schedule-${s.scheduleId}`,
                  date: s.date,
                  title: s.name ?? '(제목 없음)',
                  color: undefined,
                  pinned: false,
                })
              );
            }
          } catch (innerErr) {
            console.warn(`⚠️ 일정 없음 (${dateStr})`);
          }
        }

       const all = [...allSchedules, ...mappedEvents];  // ⬅ 순서 반대!
const unique = Array.from(
  new Map(all.map((e) => [`${e.date}_${e.title}`, e])).values()
);
dispatch({ type: 'SET_EVENTS', payload: unique });

        console.log('📅 서버에서 불러온 전체 일정:', all);
      } catch (err) {
        console.error('❌ 서버 일정 불러오기 실패:', err);
      }
    
    };

    loadEventsAndSchedules();
  }, []);
  /** API (기존 그대로) */
  const api = useMemo<Ctx>(() => ({
    state,

    addEvent: (date, title, color) => {
      const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
      dispatch({ type: 'ADD_EVENT', payload: { id, date, title, color } });
      return id;
    },
    updateEvent: (id, patch) => dispatch({ type: 'UPDATE_EVENT', payload: { id, patch } }),
    deleteEvent: (id) => dispatch({ type: 'DELETE_EVENT', payload: { id } }),
    togglePinned: (id) => {
      const target = state.events.find(e => e.id === id);
      if (!target) return;
      dispatch({ type: 'UPDATE_EVENT', payload: { id, patch: { pinned: !target.pinned } } });
    },
    eventsByDate: (date) => state.events.filter(e => e.date === date),
    groupEventsByDate: () =>
      state.events.reduce<Record<string, EventItem[]>>((acc, e) => {
        (acc[e.date] ??= []).push(e);
        return acc;
      }, {}),
    pinnedForMonth: (d) => {
      const mk = monthKeyOf(d);
      return state.events.filter(e => e.pinned && e.date.startsWith(mk));
    },

    setDiary: (date, diary) => {
      const fullDiary = { ...diary, diaryDate: date };
      dispatch({ type: 'SET_DIARY', payload: fullDiary });
    },
    getDiary: (date) => state.diaries[date],
    deleteDiary: (date) => dispatch({ type: 'DELETE_DIARY', payload: { date } }),

    setPhoto: (p) => dispatch({ type: 'SET_PHOTO', payload: p }),
    getPhoto: (date) => state.photoAnalyses[date],
    clearPhoto: (date) => dispatch({ type: 'CLEAR_PHOTO', payload: { date } }),

    setGifts: (date, gifts) => dispatch({ type: 'SET_GIFTS', payload: { date, gifts } }),
    getGifts: (date) => state.gifts[date],
  }), [state]);

  return <CalendarContext.Provider value={api}>{children}</CalendarContext.Provider>;
};

/** ---------- Hook ---------- */
export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
};

/** ---------- Export 유틸 ---------- */
export const dateKeyOf = keyOf;
export const monthKey = monthKeyOf;
