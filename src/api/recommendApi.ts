// src/api/recommendApi.ts
import api from './axiosInstance'; // calendarApi.ts와 동일하게 통일

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  pageInfo?: any;
};

// 🎁 추천 선물 조회 API
export const getRecommendGifts = async (date: string) => {
  console.log('📤 getRecommendGifts() 호출:', date);
  const res = await api.get<ApiResponse<any>>(`/recommend`, {
    params: { date },
  });
  return res.data.result || [];
};
