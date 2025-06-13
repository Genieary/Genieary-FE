import React, { useState } from "react";
import kakaoLoginImg from "../../assets/kakao_login_medium_narrow.png";

const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI ?? "";
const SCOPE = "account_email,profile_nickname";

const KakaoLoginButton: React.FC = () => {
  const [clicked, setClicked] = useState(false);

  const handleLogin = () => {
    if (clicked) return;
    setClicked(true);

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      disabled={clicked}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer"
      }}
      aria-label="카카오로 로그인"
    >
      <img
        src={kakaoLoginImg}
        alt="카카오 로그인"
        style={{ height: 45 }}
      />
    </button>
  );
};

export default KakaoLoginButton;
