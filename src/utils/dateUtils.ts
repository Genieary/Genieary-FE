// src/utils/dateUtils.ts

/**
 * 프론트의 Date 객체를 서버에 보낼 yyyy-MM-dd 문자열로 변환
 * - KST 기준 하루 밀림 방지
 * - UTC 변환 문제 해결
 */
export const formatDateForServer = (date: Date): string => {
  const offset = date.getTimezoneOffset(); // 분 단위 시차 (KST는 -540)
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0]; // "yyyy-MM-dd"
};
