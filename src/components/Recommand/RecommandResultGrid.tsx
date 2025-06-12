import React, { useState } from "react";
import styled from "styled-components";

// 이미지/아이콘 SVG 파일 import
import AirpodsImg from "../../assets/mock/airpods.png";
import PlaneImg from "../../assets/mock/plane.png";
import FreedomImg from "../../assets/mock/freedom.png";
import HeartDefaultIcon from "../../assets/heart-default.svg";
import HeartLikedIcon from "../../assets/heart-liked.svg";
import BrokenHeartDefaultIcon from "../../assets/broken-heart-default.svg";
import BrokenHeartDislikedIcon from "../../assets/broken-heart-disliked.svg";

// 목업 데이터
const resultData = [
  { id: "item1", label: "에어팟 4세대", img: AirpodsImg },
  { id: "item2", label: "비행기", img: PlaneImg },
  { id: "item3", label: "자유", img: FreedomImg },
];

type LikeStatus = 'liked' | 'disliked' | 'none';

// --- 스타일 컴포넌트 ---
const ResultGridContainer = styled.div`
  margin-left: -70px;
  margin-bottom: 40px; 
  width: 1024px;
  height: 360px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 38px;
  background: #fff;
  border-radius: 18px;
 box-shadow: 0 8px 24px -4px rgba(0,0,0,0.10),  /* 아래 그림자 */
            0 -8px 24px -4px rgba(0,0,0,0.10); /* 위 그림자 */
  padding: 32px;
  align-items: end;
  justify-items: center;
  box-sizing: border-box;
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ResultCard = styled.div`
  background: #f8f9fa;
  border-radius: 13px;
  padding:80px 18px 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const ResultImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  margin-top: 18px;
  padding: 0 8px;
`;

const ResultLabel = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
`;

const LikeRow = styled.div`
  display: flex;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 0;
`;

const IconImage = styled.img`
  width: 35px;
  height: 35px;
`;
// --- 스타일 끝 ---

const RecommandResultGrid: React.FC = () => {
  const [likeStatus, setLikeStatus] = useState<Record<string, LikeStatus>>({});

  const handleLike = (id: string) => {
    setLikeStatus(prev => ({
      ...prev,
      [id]: prev[id] === 'liked' ? 'none' : 'liked',
    }));
  };

  const handleDislike = (id: string) => {
    setLikeStatus(prev => ({
      ...prev,
      [id]: prev[id] === 'disliked' ? 'none' : 'disliked',
    }));
  };

  return (
    <ResultGridContainer>
      {resultData.map((item) => {
        const status = likeStatus[item.id] || 'none';
        const isLiked = status === 'liked';
        const isDisliked = status === 'disliked';

        return (
          <CardWrapper key={item.id}>
            <ResultCard>
              <ResultImage src={item.img} alt={item.label} />
            </ResultCard>
            <InfoRow>
              <ResultLabel>{item.label}</ResultLabel>
              <LikeRow>
                <IconButton onClick={() => handleLike(item.id)}>
                  <IconImage src={isLiked ? HeartLikedIcon : HeartDefaultIcon} alt="좋아요" />
                </IconButton>
                <IconButton onClick={() => handleDislike(item.id)}>
                  <IconImage src={isDisliked ? BrokenHeartDislikedIcon : BrokenHeartDefaultIcon} alt="싫어요" />
                </IconButton>
              </LikeRow>
            </InfoRow>
          </CardWrapper>
        );
      })}
    </ResultGridContainer>
  );
};

export default RecommandResultGrid;
