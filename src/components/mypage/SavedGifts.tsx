import { useState } from "react";
import styled from "styled-components";

// 더미 데이터
const initialGifts = [
  {
    id: 1,
    name: "에어팟 4세대",
    image:
      "/images/airpods.png",
    isPublic: true,
  },
  {
    id: 2,
    name: "비행기",
    image:
      "/images/plane.png",
    isPublic: true,
  },
    {
    id: 3,
    name: "비행기",
    image:
      "/images/plane.png",
    isPublic: false,
  },
    {
    id: 4,
    name: "비행기",
    image:
      "/images/plane.png",
    isPublic: false,
  },
  {
    id: 5,
    name: "자유",
    image: "/images/freedom.png",
    isPublic: false,
  },
  
];

const SavedGifts = () => {
  const [gifts, setGifts] = useState(initialGifts);

  // 공개/비공개 토글
  const toggleVisibility = (id: number) => {
    setGifts((prev) =>
      prev.map((gift) =>
        gift.id === id ? { ...gift, isPublic: !gift.isPublic } : gift
      )
    );
  };

  // 삭제
  const deleteGift = (id: number) => {
    setGifts((prev) => prev.filter((gift) => gift.id !== id));
  };

return (
  <Card>
    {gifts.length === 0?(
        <EmptyMessage>저장된 선물이 없어요!</EmptyMessage>
    ): (
    <GiftGrid>
      {gifts.map((gift) => (
        <GiftItem key={gift.id}>
  <ImageContainer>
    <GiftImage src={gift.image} alt={gift.name} />
  </ImageContainer>
  <InfoRow>
    <GiftName>{gift.name}</GiftName>
    <ActionRow>
      <IconButton
        $type="eye"
        onClick={() => toggleVisibility(gift.id)}
      >
        {gift.isPublic ? <svg width="40" height="39" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="19.5455" cy="19.5" rx="19.5455" ry="19.5" fill="#FFF5BF"/>
<g clip-path="url(#clip0_787_816)">
<path d="M9 20C9 20 13 12 20 12C27 12 31 20 31 20C31 20 27 28 20 28C13 28 9 20 9 20Z" stroke="#FF922B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 23C21.6569 23 23 21.6569 23 20C23 18.3431 21.6569 17 20 17C18.3431 17 17 18.3431 17 20C17 21.6569 18.3431 23 20 23Z" stroke="#FF922B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_787_816">
<rect width="24" height="24" fill="white" transform="translate(8 8)"/>
</clipPath>
</defs>
</svg>

 : <svg width="40" height="39" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="19.5455" cy="19.5" rx="19.5455" ry="19.5" fill="#FFF5BF"/>
<g clip-path="url(#clip0_787_810)">
<path d="M25.94 25.94C24.2306 27.243 22.1491 27.9649 20 28C13 28 9 20 9 20C10.2439 17.6819 11.9691 15.6566 14.06 14.06M17.9 12.24C18.5883 12.0789 19.2931 11.9983 20 12C27 12 31 20 31 20C30.393 21.1356 29.6691 22.2047 28.84 23.19M22.12 22.12C21.8454 22.4147 21.5141 22.6512 21.1462 22.8151C20.7782 22.9791 20.3809 23.0673 19.9781 23.0744C19.5753 23.0815 19.1752 23.0074 18.8016 22.8565C18.4281 22.7056 18.0887 22.481 17.8038 22.1962C17.519 21.9113 17.2944 21.5719 17.1435 21.1984C16.9926 20.8248 16.9185 20.4247 16.9256 20.0219C16.9327 19.6191 17.0209 19.2218 17.1849 18.8538C17.3488 18.4859 17.5853 18.1546 17.88 17.88M9 9L31 31" stroke="#FF922B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_787_810">
<rect width="24" height="24" fill="white" transform="translate(8 8)"/>
</clipPath>
</defs>
</svg>

}
      </IconButton>
      <IconButton
        $type="delete"
        onClick={() => deleteGift(gift.id)}
      >
       <svg width="40" height="39" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="19.5455" cy="19.5" rx="19.5455" ry="19.5" fill="#FFE3E2"/>
<path d="M14.0908 29C13.5408 29 13.07 28.8042 12.6783 28.4125C12.2867 28.0208 12.0908 27.55 12.0908 27V14H11.0908V12H16.0908V11H22.0908V12H27.0908V14H26.0908V27C26.0908 27.55 25.895 28.0208 25.5033 28.4125C25.1117 28.8042 24.6408 29 24.0908 29H14.0908ZM24.0908 14H14.0908V27H24.0908V14ZM16.0908 25H18.0908V16H16.0908V25ZM20.0908 25H22.0908V16H20.0908V25Z" fill="#E85C5A"/>
</svg>


      </IconButton>
    </ActionRow>
  </InfoRow>
</GiftItem>

      ))}
    </GiftGrid>
    )}
  </Card>
);

};

export default SavedGifts;

/* ---------------- styled-components ---------------- */

const Card = styled.div`
  background: white;
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-height: 600px;
`;
const EmptyMessage = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #999;
  padding: 60px 0;
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 53px;
`;

const GiftItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ImageContainer = styled.div`
  width: 283px;
  height: 251px;
  background: #F8F9FA;   /* ✅ 배경색 */
  border-radius: 12px;   /* ✅ 모서리 둥글게 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

// const GiftImage = styled.img`
//   max-width: 80%;   /* 컨테이너 안에서 적절히 맞춤 */
//   max-height: 80%;
//   object-fit: contain;
// `;

const GiftImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 17px;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;   /* ✅ 버튼과 텍스트가 같은 줄에 */
  max-width: 283px;
  gap: 8px;
`;

const GiftName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
`;

const IconButton = styled.button<{ $type: "eye" | "delete" }>`
  all: unset;           /* 기본 버튼 스타일 완전히 제거 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 필요하다면 클릭 영역만 확보 */
  width: 40px;
  height: 39px;

  /* svg는 부모의 크기에 맞게 들어감 */
  & > svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

