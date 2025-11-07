// src/api/diaryApi.ts
import axiosInstance from './axiosInstance';
import api from './axiosInstance'; //임추
import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface DiaryRequest {
  content: string;
  isLiked: boolean;
  diaryDate: string; // "YYYY-MM-DD"
}

export interface DiaryResponse {
  diaryId: number;
  content: string;
  createdAt: string;
  isLiked: boolean;
  diaryDate: string;
}

// 일기 작성
// export const createDiary = async (data: DiaryRequest): Promise<DiaryResponse> => {
//   const res = await axiosInstance.post('/diary', data);
//   return res.data.result;
// };
 export const createDiary = async (body: any) => {
  console.log("📤 createDiary() 호출됨");
  console.log("📦 전송할 Body:", body);

  try {
    const res = await api.post('/diary', body);
    console.log("✅ 서버 응답:", res.data);
    return res.data.result;
  } catch (err: any) {
    console.error("❌ 서버 요청 실패:", err.response?.status, err.response?.data);
    throw err;
  }
};

// 일기 조회
export const getDiaryById = async (diaryId: number): Promise<DiaryResponse> => {
  const res = await axiosInstance.get(`/diary/${diaryId}`);
  return res.data.result;
};
// ✅ 날짜로 일기 조회 (GET /api/diary?date=YYYY-MM-DD)
export const getDiaryByDate = async (date: string): Promise<DiaryResponse | null> => {
  try {
    console.log("📤 getDiaryByDate() 호출:", date);
    const res = await api.get(`/diary`, { params: { date } });
    console.log("✅ getDiaryByDate() 응답:", res.data);
    return res.data.result;
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.log("❌ 해당 날짜에 일기가 없습니다.");
      return null; // 없을 때는 null 리턴
    }
    console.error("❌ 일기 조회 실패:", err.response?.status, err.response?.data);
    throw err;
  }
};


// 일기 수정
export const updateDiary = async (
  diaryId: number,
  data: Partial<DiaryRequest>
): Promise<DiaryResponse> => {
  const res = await axiosInstance.patch(`/diary/${diaryId}`, data);
  return res.data.result;
};


// 일기 삭제
export const deleteDiary = async (diaryId: number): Promise<void> => {
  await axiosInstance.delete(`/diary/${diaryId}`);
};

export const getPresignedUploadUrl = async (date: string, contentType: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${API_BASE_URL}/diary/${date}/diary-face`,
    null,
    {
      params: { contentType },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.result;
};

export const getDiaryFaceUrl = async (diaryId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(
    `${API_BASE_URL}/diary/${diaryId}/diary-face-url`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.result;
};
