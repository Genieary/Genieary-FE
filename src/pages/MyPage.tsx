import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import MyPageSidebar from "../components/mypage/MyPageSidebar";
import MyInfo from "../components/mypage/MyInfo";
import PasswordCheck from "../components/mypage/PasswordCheck";
import EditInfo from "../components/mypage/EditInfo";
import SavedGifts from "../components/mypage/SavedGifts";

const MyPage = () => {
  return (
    <Wrapper>
      <MyPageSidebar />
      <Content>
        <Routes>
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
