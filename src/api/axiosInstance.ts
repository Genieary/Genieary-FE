import axios from 'axios';

console.log("✅ API URL:", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터 추가 (모든 요청에 토큰 자동 포함)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 로그인 시 저장된 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
