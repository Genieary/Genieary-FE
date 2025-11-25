import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import MyPageSidebar from "../components/mypage/MyPageSidebar";
import MyInfo from "../components/mypage/MyInfo";
import PasswordCheck from "../components/mypage/PasswordCheck";
import EditInfo from "../components/mypage/EditInfo";
import SavedGifts from "../components/mypage/SavedGifts";
import { AuthService } from "../services/authService";

const MyPage = () => {
  const navigate = useNavigate();
  const currentUserId = AuthService.getUserId();
  useEffect(() => {
    if (!currentUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login", { replace: true });
    }
  }, [currentUserId, navigate]);

  return (
    <Wrapper>
      <MyPageSidebar />
      <Content>
        <Routes>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<MyInfo />} />
          <Route path="password-check" element={<PasswordCheck />} />
          <Route path="edit" element={<EditInfo />} />
          <Route path="gifts" element={<SavedGifts/>} />
          <Route path="days" element={<div>저장된 하루</div>} />
        </Routes>
      </Content>
    </Wrapper>
  );
};

export default MyPage;


const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  padding: 32px;
   
`;



const Content = styled.div`
  flex: 1;

`;
