// src/api/friendApi.ts
import api from './axiosInstance'; // calendarApi.ts와 동일하게 통일
import { ApiClient } from "./apiClient";
import { ApiResponse } from '../types/api';

// 친구 프로필 정보 조회
export const getFriendProfile = async (friendId: number) => {
  const res = await api.request({
    url: `/friend/${friendId}`,
    method: "GET",
  });
  return res.data;
};