// src/api/recommendApi.ts
import api from './axiosInstance'; // calendarApi.ts와 동일하게 통일
import { ApiClient } from "./apiClient";
import { ApiResponse } from '../types/api';

const client = ApiClient.getInstance();

// 🎁 추천 선물 조회 API
export const getRecommendGifts = async (date: string) => {
  console.log('📤 getRecommendGifts() 호출:', date);
  const res = await api.get<ApiResponse<any>>(`/recommend`, {
    params: { date },
  });
  return res.data.result || [];
};

export const getSavedGifts = async (page = 0, size = 20) : Promise<any>=> {
  return await client.request<ApiResponse<any>>(`/recommend/like?page=${page}&size=${size}`, {
    method: "GET",
  });
};

// 공개 여부 토글
export const toggleGiftVisibility = async (recommendId: number) : Promise<any> => {
  return await client.request<ApiResponse<any>>(`/recommend/${recommendId}/visibility`, {
    method: "PATCH",
  });
};

export const getFriendGiftRecommendations = async (friendId: number) => {
  const res = await api.post<ApiResponse<any>>(`/recommend/${friendId}`);
  return res.data.result;
};