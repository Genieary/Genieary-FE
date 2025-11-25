// components/mypage/MyInfo.tsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserApi } from "../../api/userApi";
import { personalityToKorean } from "../../utils/personalityUtils";

const userApi = new UserApi();

const MyInfo = () => {
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [personalities, setPersonalities] = useState<string[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();

        setProfileImg(data.profileImage);
        setNickname(data.nickname);
        setUserId(data.email);

        const koreanPersonalities = data.personalities.map(
          (p) => personalityToKorean[p] || p
        );
    
        setPersonalities(koreanPersonalities);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Card>
      <Header>
        <Title>내 정보</Title>
        <EditButton onClick={() => navigate("/mypage/password-check")}>
          내 정보 수정하기
        </EditButton>
      </Header>

      <Profile>
        <ProfileImg $img={profileImg}/>
        <InfoBlock>
          <Name>{nickname}</Name>
          <UserId>{userId}</UserId>
        </InfoBlock>
      </Profile>

      
      <Row>
        <Label>닉네임</Label>
        <Value>{nickname}</Value>
      </Row>
      <Row>
        <Label>비밀번호</Label>
        <Value>********</Value>
      </Row>
      <Row>
        <Label>성격키워드</Label>
        <TagList>
          {personalities.map((p) => (
            <Tag key={p}>{p}</Tag>
          ))}
        </TagList>
      </Row>

      <BottomRow>
        <LogoutButton>로그아웃</LogoutButton>
        <DeleteButton>회원 탈퇴하기</DeleteButton>
      </BottomRow>
    </Card>
  );
};

export default MyInfo;

// styled-components
const Card = styled.div`
  background: white;
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: 600px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div` 
  font-size: 20px;
  color: #333;
  font-weight: 600;
  text-decoration: none;
  text-align: center;`;

const EditButton = styled.button`
  font-size: 20px;
  background: none;
  border: none;
  color: #716E6E;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;  
  text-underline-offset: 2px;  

  &:hover {
    color:  #4A6CF6;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileImg = styled.div<{ $img?: string | null }>`
  width: 150px;
  height: 150px;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover no-repeat` : "#FFF3BF"};
  border-radius: 50%;
  margin-right: 20px;
`;

const InfoBlock = styled.div`
   display: flex;
   align-items: center;
   gap: 20px;
`;

const Name = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const UserId = styled.div`
  color: gray;
  font-size: 20px;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 27px;
  align-items: center;
  font-size: 20px;
`;

const Label = styled.div`
  width: 100px;
  font-weight: 600;
  color: #716E6E;
`;

const Value = styled.div`
  font-weight: 600;
  color: black;
  `;

const TagList = styled.div`
  display: flex;
  gap: 20px;
`;

const Tag = styled.div`
  background: #D2F9D9;
  color: #2B8A3E;
  padding: 9px 20px;
  border-radius: 20px;
  border: 1px solid #2B8A3E;
  font-weight: 600;

`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 160px;
`;

const LogoutButton = styled.button`

  background: #4A6CF6;
  font-size: 20px;
  color: white;
  border: none;
  padding: 13px 50px;
  border-radius: 30px;
  font-weight: 600;
`;

const DeleteButton = styled.button`
  font-size: 20px;
  background: none;
  font-weight: 600;
  color: #E85C5A;
  border: none;
  cursor: pointer;
  text-decoration: underline;  
  text-underline-offset: 2px;  
`;
