import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styled from "styled-components";
import { UserApi } from "../api/userApi";

const OAuthKakaoCallback: React.FC = () => {
  const [called, setCalled] = useState(false);
  const navigate = useNavigate();
  const { kakaoLogin, loading, error } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const handleKakaoCallback = async () => {
      try {
        const code = new URL(window.location.href).searchParams.get("code");
        if (!code) {
          console.warn("카카오 인증 코드가 없습니다.");
          navigate("/login");
          return;
        }

        if (called) return;
        setCalled(true); //중복 방지
        
        const result = await kakaoLogin({ code });
        if (!result) {
          alert("카카오 로그인에 실패했습니다.");
          navigate("/login");
          return;
        }

        try {
          const userApi = new UserApi();
          const isCompleted = await userApi.getProfileStatus();
          navigate(isCompleted ? "/" : "/onboarding/profile");
        } catch (profileErr) {
          console.error("프로필 상태 확인 중 오류:", profileErr);
          navigate("/");
        }
      } catch (err) {
        console.error("카카오 로그인 처리 중 오류:", err);
        navigate("/login");
      }
    };

    handleKakaoCallback();
  }, [called, kakaoLogin, navigate]);

  if (error) {
    return (
      <Container>
        <ErrorMessage>카카오 로그인 처리 중 오류가 발생했습니다.</ErrorMessage>
        <RetryButton onClick={() => navigate('/login')}>
          로그인 페이지로 돌아가기
        </RetryButton>
      </Container>
    );
  }
  return (
    <Container>
      <LoadingMessage>
        {loading ? "카카오 로그인 처리 중..." : "로그인 처리 중..."}
      </LoadingMessage>
      <Spinner />
    </Container>
  );
};

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
padding: 20px;
`;

const LoadingMessage = styled.div`
font-size: 18px;
color: #333;
margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
font-size: 16px;
color: #ff4757;
margin-bottom: 20px;
text-align: center;
`;

const RetryButton = styled.button`
padding: 12px 24px;
background-color: #007bff;
color: white;
border: none;
border-radius: 8px;
font-size: 16px;
cursor: pointer;
transition: background-color 0.3s;

&:hover {
  background-color: #0056b3;
}
`;

const Spinner = styled.div`
width: 40px;
height: 40px;
border: 4px solid #f3f3f3;
border-top: 4px solid #3498db;
border-radius: 50%;
animation: spin 1s linear infinite;

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default OAuthKakaoCallback;
