import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/chat',
  withCredentials: true, // 필요 시 세션/쿠키 사용
});

// 로그인 시 받은 토큰/ID를 로컬 스토리지 등에서 꺼내서 헤더로 삽입
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 예시, 실제 구현에 맞게 변경
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
