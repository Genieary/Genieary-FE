// src/store/calendarStore.tsx
import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type EventItem = {
  id: string;
  date: string;          // 'YYYY-MM-DD'
  title: string;
  color?: string;
  pinned?: boolean;      // true면 사이드바 "이번 달 이벤트"에 노출
};

export type Diary = { date: string; content: string };

export type PhotoAnalysis = {
  date: string;
  imageDataUrl?: string;
  summary?: string;
  stats?: { sunny: number; cloudy: number; rainy: number };
};

type State = {
  events: EventItem[];
  diaries: Record<string, Diary>;
  photoAnalyses: Record<string, PhotoAnalysis>;
};

type Action =
  | { type: 'ADD_EVENT'; payload: EventItem }
  | { type: 'UPDATE_EVENT'; payload: { id: string; patch: Partial<EventItem> } }
  | { type: 'DELETE_EVENT'; payload: { id: string } }
  | { type: 'SET_DIARY'; payload: Diary }
  | { type: 'DELETE_DIARY'; payload: { date: string } }
  | { type: 'SET_PHOTO'; payload: PhotoAnalysis }
  | { type: 'CLEAR_PHOTO'; payload: { date: string } };

const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const monthKeyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const reducer = (s: State, a: Action): State => {
  switch (a.type) {
    case 'ADD_EVENT':
      return { ...s, events: [...s.events, a.payload] };
    case 'UPDATE_EVENT':
      return {
        ...s,
        events: s.events.map(e => (e.id === a.payload.id ? { ...e, ...a.payload.patch } : e)),
      };
    case 'DELETE_EVENT':
      return { ...s, events: s.events.filter(e => e.id !== a.payload.id) };
    case 'SET_DIARY':
      return { ...s, diaries: { ...s.diaries, [a.payload.date]: a.payload } };
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
    default:
      return s;
  }
};

type Ctx = {
  state: State;
  addEvent: (date: string, title: string, color?: string) => string; // returns id
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  togglePinned: (id: string) => void;
  eventsByDate: (date: string) => EventItem[];
  groupEventsByDate: () => Record<string, EventItem[]>;
  pinnedForMonth: (d: Date) => EventItem[];
  setDiary: (date: string, content: string) => void;
  getDiary: (date: string) => Diary | undefined;
  deleteDiary: (date: string) => void;
  setPhoto: (p: PhotoAnalysis) => void;
  getPhoto: (date: string) => PhotoAnalysis | undefined;
  clearPhoto: (date: string) => void;
};

const CalendarContext = createContext<Ctx | null>(null);

const initialState: State = {
  events: [
    // 샘플
    { id: 'e1', date: '2025-09-05', title: '어린이 생일', pinned: true },
    { id: 'e2', date: '2025-09-08', title: '아림이 집들이', pinned: true },
    { id: 'e3', date: '2025-09-30', title: '야옹 파티',  pinned: true },
  ],
  diaries: {},
  photoAnalyses: {},
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    groupEventsByDate: () => {
      return state.events.reduce<Record<string, EventItem[]>>((acc, e) => {
        (acc[e.date] ??= []).push(e);
        return acc;
      }, {});
    },
    pinnedForMonth: (d) => {
      const mk = monthKeyOf(d);
      return state.events.filter(e => e.pinned && e.date.startsWith(mk));
    },
    setDiary: (date, content) => dispatch({ type: 'SET_DIARY', payload: { date, content } }),
    getDiary: (date) => state.diaries[date],
    deleteDiary: (date) => dispatch({ type: 'DELETE_DIARY', payload: { date } }),
    setPhoto: (p) => dispatch({ type: 'SET_PHOTO', payload: p }),
    getPhoto: (date) => state.photoAnalyses[date],
    clearPhoto: (date) => dispatch({ type: 'CLEAR_PHOTO', payload: { date } }),
  }), [state]);

  return <CalendarContext.Provider value={api}>{children}</CalendarContext.Provider>;
};

export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
};

export const dateKeyOf = keyOf;
export const monthKey = monthKeyOf;
