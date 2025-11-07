// src/api/analysisApi.ts
import axios from 'axios';

const API_BASE_URL = 'https://genieary.site';

export const analyzeEmotionByUrl = async (diaryDate: string, faceImgUrl: string) => {
  try {
    const token = localStorage.getItem('accessToken'); // ✅ 로그인 시 저장된 토큰

    const response = await axios.post(
      `${API_BASE_URL}/ai/face-analysis`,
      null,
      {
        params: {
          diaryDate,
          faceImg: faceImgUrl,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ 감정 분석 응답:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ 감정 분석 요청 실패:', error);
    throw error;
  }
};
// 🧠 1. 감정분석 조회
export const getAnalysisByDiaryId = async (diaryId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/ai/${diaryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result; // { predictedEmotion, allPredictions, analysis }
};

// 🗑️ 2. 감정분석 삭제
export const deleteAnalysisByDiaryId = async (diaryId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.delete(`${API_BASE_URL}/ai/${diaryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { isSuccess, code, message, result }
};