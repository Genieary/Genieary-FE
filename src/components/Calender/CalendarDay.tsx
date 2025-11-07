import React from 'react';
import styled from 'styled-components';

export interface DayEvent {
  title: string;
  color?: string;
}

interface CalendarDayProps {
  day?: number;
  isToday?: boolean;
  isHoliday?: boolean;
  isCurrentMonth?: boolean;
  events?: DayEvent[];
  onClick?: () => void;
}

/** ------ 팔레트 & 유틸 ------ */
const PALETTES = [
  { bg: '#D2F9D9', fg: '#2B8A3E' },
  { bg: '#FFF3BF', fg: '#FF993C' },
  { bg: '#FFE3E2', fg: '#E85C5A' },
] as const;

// // 🎲 랜덤 팔레트 선택 함수
// const pickPalette = (title: string, day?: number, overrideBg?: string) => {
//   if (overrideBg) {
//     const found = PALETTES.find(p => p.bg.toLowerCase() === overrideBg.toLowerCase());
//     return found ?? { bg: overrideBg, fg: '#000' };
//   }

//   // 🔥 랜덤 인덱스 생성
//   const idx = Math.floor(Math.random() * PALETTES.length);
//   return PALETTES[idx];
// };
const pickPalette = (title: string, day?: number, overrideBg?: string) => {
  // 만약 명시적인 color가 있으면 우선 사용
  if (overrideBg) {
    const found = PALETTES.find(p => p.bg.toLowerCase() === overrideBg.toLowerCase());
    return found ?? { bg: overrideBg, fg: '#000' };
  }

  // 🎲 항상 랜덤 팔레트 반환 (색이 없더라도)
  const idx = Math.floor(Math.random() * PALETTES.length);
  return PALETTES[idx];
};



/** ------ 메인 컴포넌트 ------ */
const CalendarDay: React.FC<CalendarDayProps> = ({
  day, isToday, isHoliday, isCurrentMonth, events = [], onClick,
}) => {
  return (
    <Wrapper $isToday={isToday} $isHoliday={isHoliday} onClick={onClick}>
      <DayNumber $isCurrentMonth={isCurrentMonth}>{day ?? ''}</DayNumber>
      <Events>
        {events.map((ev, idx) => {
          const { bg, fg } = pickPalette(ev.title, day, ev.color);
          return (
            <Event key={idx} $bg={bg} $fg={fg} title={ev.title}>
              {ev.title}
            </Event>
          );
        })}
      </Events>
    </Wrapper>
  );
};

export default CalendarDay;

/** ------ styles ------ */
// ✅ transient props ($)로 변경해서 DOM 전달 방지
const Wrapper = styled.div<{ $isToday?: boolean; $isHoliday?: boolean }>`
  background-color: ${({ $isToday }) => ($isToday ? '#E0E6FF' : '#F8F9FA')};
  border-radius: 8px;
  padding: 6px 8px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isToday }) => ($isToday ? '#d4daff' : '#e9ecef')};
  }
`;

const DayNumber = styled.div<{ $isCurrentMonth?: boolean }>`
  font-weight: 500;
  font-size: 14px;
  color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? '#000' : '#ccc')};
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

const Event = styled.div<{ $bg: string; $fg: string }>`
  background-color: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
