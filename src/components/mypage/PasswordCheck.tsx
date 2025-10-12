// components/mypage/PasswordCheck.tsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PasswordCheck = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <Header>           
        <BackButton onClick={() => navigate(-1)}><svg width="14" height="23" viewBox="0 0 14 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.25 11.5L13.875 20.125L11.25 22.75L0 11.5L11.25 0.25L13.875 2.875L5.25 11.5Z" fill="#1D1B20"/>
</svg>

        </BackButton>
        <Titlea>비밀번호 확인</Titlea>
      </Header>

      <Title>개인정보를 보호하기 위해, 현재 비밀번호를 입력해주세요.</Title>
      <Input type="password" placeholder="비밀번호를 입력하세요" />
      <ConfirmButton onClick={() => navigate("/mypage/edit")}>확인</ConfirmButton>
    </Card>
  );
};

export default PasswordCheck;

const Card = styled.div`
  background: white;
  text-align: center;
  background: white;
  padding: 40px 50px;
  padding-left: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  margin: 0 auto;  /* 가운데 정렬 */
  height: 600px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 80px;
  
  color: #716E6E;
  
`;
const BackButton = styled.button`
  background: none;
  border: none;
  
  cursor: pointer;
`;

const Titlea = styled.div`
  font-size: 20px;
  font-weight: 600;
  
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 85px;

`;

const Input = styled.input`
  padding: 18px 35px;
  width: 600px;
  border: 1px solid #C2C2C2;
  border-radius: 20px;
  margin-bottom: 85px;
  background: #F8F9FA;
  font-size: 20px;
  
  &::placeholder {
    color: #716E6E;  
    font-weight: 600;    
    font-size: 20px;    
  }


`;

const ConfirmButton = styled.button`
  background: #4A6CF6;
  color: white;
  border: none;
//   padding: 22px 100px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  margin: 0 auto;
  display: block;
  font-size: 20px;
  padding: 13px 50px;
 

`;
