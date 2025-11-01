// src/api/analysisApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://3.35.11.41:8000'; // ✅ FastAPI 서버 주소

// 📸 감정 분석 (파일 업로드)
export const analyzeEmotionByFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/analyze/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ 감정 분석 응답:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 감정 분석 요청 실패:', error);
    throw error;
  }
};
