// src/components/Login/KakaoLoginButton.tsx
import React, { useState } from "react";
import styled from "styled-components";
import kakaoLoginImg from "../../assets/kakao_login_medium_narrow.png";

const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI ?? "";
const SCOPE = "account_email,profile_nickname";

interface KakaoLoginButtonProps {
  disabled?: boolean;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ disabled = false }) => {
  const [clicked, setClicked] = useState(false);

  const handleLogin = () => {
    if (clicked || disabled) return;
    
    // 환경 변수 체크
    if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
      alert('카카오 로그인 설정이 올바르지 않습니다.');
      return;
    }

    setClicked(true);

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(SCOPE)}`;
    
    window.location.href = kakaoAuthUrl;
  };

  return (
    <KakaoButton
      onClick={handleLogin}
      disabled={clicked || disabled}
      aria-label="카카오로 로그인"
    >
      <img
        src={kakaoLoginImg}
        alt="카카오 로그인"
        style={{ 
          height: 45,
          opacity: clicked || disabled ? 0.6 : 1
        }}
      />
      {clicked && <LoadingText>로그인 중...</LoadingText>}
    </KakaoButton>
  );
};

const KakaoButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:disabled {
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const LoadingText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #000;
  font-weight: bold;
`;

export default KakaoLoginButton;
