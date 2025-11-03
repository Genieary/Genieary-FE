// src/pages/LoginPage.tsx
import React, { useState }  from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import KakaoLoginButton from "../components/Login/KakaoLoginButton";
import { useAuth } from "../hooks/useAuth";
import { UserApi } from "../api/userApi";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await login({ email, password });

      if (result) {
        const userApi = new UserApi();
        const isCompleted = await userApi.getProfileStatus();

        if (isCompleted) {
          navigate("/"); 
        } else {
          navigate("/onboarding/profile"); 
        }
      }
    } catch (err: any) {
      console.error("로그인 후 상태 확인 실패:", err);
      toast.error(err.message || "로그인 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <LoginContainer>
        <Title>로그인</Title>
      <LoginBox>
        <FormContainer onSubmit={handleSubmit}>
          <InputField>
            <input 
                type="email" 
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
          </InputField>
          
          <InputField>
            <input 
                type="password" 
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
          </InputField>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </LoginButton>
        </FormContainer>
        
        <Divider/>

        <SocialLoginContainer>
          <KakaoLoginButton disabled={loading} />
        </SocialLoginContainer>
        
        <LinkContainer>
          <span>아직 회원이 아니신가요? </span>
          <SignupLink href="/signup">회원가입하기</SignupLink>
        </LinkContainer>
      </LoginBox>
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;   
  padding-top: 80px;             
  background-color: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 900;
  color: #333;
  margin-bottom: 20px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;


const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 20px;
`;

const InputField = styled.div`
  input {
    width: 100%;
    box-sizing: border-box; 
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    background-color:rgb(247, 246, 246);

    &:focus {
      border-color: #007bff;
    }

    &::placeholder {
      color: #999;
    }
  }
`;


const LoginButton = styled.button`
  width: 183px;
  padding: 13px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0 auto;

  &:hover {
    background-color: #0056b3;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #666;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #eee;
    z-index: 1;
  }
  
  &::after {
    content: '또는';
    background: white;
    padding: 0 16px;
    position: relative;
    z-index: 2;
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const LinkContainer = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const SignupLink = styled.a`
  color: #007bff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 14px;
  margin-top: -8px;
`;

export default LoginPage;
