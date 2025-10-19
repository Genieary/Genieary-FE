import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { getPresignedUploadUrl, uploadFileToS3, getProfileImageUrl } from "../../api/s3Api"; 

const keywords = [
  "계획적인", "활기있는", "차분한", "분석적인", "충동적인", "사교적인",
  "열정적인", "완벽주의", "솔직한", "절제하는", "공격적인", "진지한",
  "외톨이", "깔끔한", "질투많은", "겸손한", "우울한", "단순한",
  "밀령이는", "욕심있는", "내성적", "외향적"
];

const EditInfo = () => {
  // ✅ 상태 관리
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 실제 저장된 닉네임
  const [nickname, setNickname] = useState("고양이");
  // 입력창에서 수정 중인 닉네임
  const [editedNickname, setEditedNickname] = useState("");

  const userId = "아이디123"; // 더미 아이디

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    "열정적인",
    "솔직한",
    "공격적인",
  ]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const url = await getProfileImageUrl();
        if (url) setProfileImg(url);
      } catch (err) {
        console.error("프로필 이미지 조회 실패:", err);
      }
    };
    fetchProfileImage();
  }, []);

  // 프로필 사진 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

      setSelectedFile(file); // 저장 버튼 누를 때 업로드할 파일 저장

      const previewUrl = URL.createObjectURL(file); // 로컬 미리보기 URL 생성
      setProfileImg(previewUrl);
  };
  
  // 키워드 선택/해제
  const handleKeywordClick = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else {
      if (selectedKeywords.length < 3) {
        setSelectedKeywords([...selectedKeywords, keyword]);
      } else {
        alert("성격 키워드는 최대 3개까지만 선택할 수 있습니다.");
      }
    }
  };

  // ✅ 변경 사항 저장 버튼 클릭
  const handleSave = async () => {
    try {
    // 이미지 반영
     if (selectedFile) {
      const uploadInfo = await getPresignedUploadUrl(selectedFile.type);
      if (!uploadInfo?.url) {
        alert("S3 업로드 URL 발급 실패");
        return;
      }

      await uploadFileToS3(uploadInfo.url, selectedFile);
      const newProfileUrl = await getProfileImageUrl();

      if (newProfileUrl) {
        setProfileImg(newProfileUrl); // 실제 반영
      }
      setSelectedFile(null);
    }

    // 닉네임 반영
    if (editedNickname.trim()) {
      setNickname(editedNickname);
    }
    alert("변경 사항이 저장되었습니다.");
  } catch (err) {
    console.error("❌ 변경 사항 저장 중 오류:", err);
    alert("저장 중 오류가 발생했습니다.");
  }
  };

  return (
    <Card>
      <Header>
        <Title>내 정보 수정</Title>
        <SaveButton onClick={handleSave}>변경 사항 저장</SaveButton>
      </Header>

      {/* 프로필 + 닉네임 + 아이디 */}
      <Profile>
        <ProfileImg
          onClick={() => fileInputRef.current?.click()}
          $img={profileImg}
        />
        <HiddenFileInput
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <InfoBlock>
          <Name>{nickname}</Name>
          <UserId>{userId}</UserId>
        </InfoBlock>
      </Profile>


      <Row>
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          name="nickname"
          placeholder={nickname}                // ✅ 현재 닉네임을 placeholder로 표시
          value={editedNickname}                // ✅ 입력값 유지
          onChange={(e) => setEditedNickname(e.target.value)}
        />
      </Row>
      <Row>
        <Label htmlFor="newPassword">새비밀번호</Label>
        <Input id="newPassword" name="newPassword" type="password" placeholder="새 비밀번호" />
      </Row>
      <Row>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="비밀번호 확인" />
      </Row>

      <Row $alignTop>
        <Label $alignTop htmlFor="keywords">성격키워드</Label>
        <KeywordBox id="keywords">
          {keywords.map((k) => (
            <Keyword
              key={k}
              $selected={selectedKeywords.includes(k)}
              onClick={() => handleKeywordClick(k)}
            >
              {k}
            </Keyword>
          ))}
        </KeywordBox>
      </Row>
    </Card>
  );
};

export default EditInfo;


/* ---------------- styled-components ---------------- */

const Card = styled.div`
  background: white;
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const SaveButton = styled.button`
  background: #4a6cf6;
  color: white;
  font-size: 16px;
  padding: 10px 24px;
  border-radius: 20px;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    background: #3454d1;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileImg = styled.div<{ $img: string | null }>`
  width: 150px;
  height: 150px;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover no-repeat` : "#FFF3BF"};
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
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
  font-size: 20px;
  color: gray;
  font-weight: 600;
`;

const Row = styled.div<{ $alignTop?: boolean }>`
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? "flex-start" : "center")};
  margin-bottom: 27px;
  font-size: 20px;
`;


const Label = styled.label<{ $alignTop?: boolean }>`
  width: 120px;
  font-weight: 600;
  color: #716e6e;
  flex-shrink: 0;

  ${({ $alignTop }) =>
    $alignTop &&
    `
      margin-top: 10px;
    `}
`;

const Input = styled.input`
  padding: 10px 20px;
  width: 313px;
  border: 1px solid #c2c2c2;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  background: #F8F9FA;

  &::placeholder {
    color: #716E6E;  
    font-weight: 600;    
    font-size: 20px;    
  }
`;
const KeywordBox = styled.div`
  display: flex;
  flex-wrap: wrap;      /* 줄바꿈 허용 */
  gap: 16px 20px;       /* 세로 16px, 가로 20px 간격 */
  flex: 1;
`;

const Keyword = styled.div<{ $selected: boolean }>`   
  padding: 9px 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#2B8A3E" : "#C2C2C2")};
  background: ${({ $selected }) => ($selected ? "#D2F9D9" : "#F8F9FA")};
  color: ${({ $selected }) => ($selected ? "#2B8A3E" : "#716E6E")};


`;

  