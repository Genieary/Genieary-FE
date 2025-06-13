import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OAuthKakaoCallback: React.FC = () => {
  const [called, setCalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!called && code) {
      setCalled(true); // 중복 방지
      fetch(`/api/auth/kakao?code=${code}`)
        .then(res => res.json())
        .then(data => {
          // JWT 토큰 저장 (예: localStorage)
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          // 원하는 페이지로 이동
          navigate('/');
        })
        .catch(() => {
          alert('로그인 실패');
          navigate('/login');
        });
    }
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default OAuthKakaoCallback;
