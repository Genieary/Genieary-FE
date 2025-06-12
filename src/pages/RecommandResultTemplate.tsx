import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled from "styled-components";
import RecommandResultHeader from "../components/Recommand/RecommandResultHeader";
import RecommandMenu, { LeftTabKey } from "../components/Recommand/RecommandMenu";
import RecommandResultGrid, { ResultItem } from "../components/Recommand/RecommandResultGrid";
import RetryButton from "../components/Recommand/RetryButton";

// 이미지 import
import AirpodsImg from "../assets/mock/airpods.png";
import PlaneImg from "../assets/mock/plane.png";
import FreedomImg from "../assets/mock/freedom.png";

// 카테고리별 결과 데이터와 헤더 텍스트 매핑
const CATEGORY_CONFIG: Record<string, { headerText: React.ReactNode; resultData: ResultItem[] }> = {
  gift: {
    headerText: <>김은삼님을 위한 <span>선물</span> 추천 결과입니다!</>,
    resultData: [
      { id: "gift1", label: "에어팟 4세대", img: AirpodsImg },
      { id: "gift2", label: "비행기", img: PlaneImg },
      { id: "gift3", label: "자유", img: FreedomImg },
    ],
  },
  food: {
    headerText: <>김은삼님을 위한 <span>음식</span> 추천 결과입니다!</>,
    resultData: [
      { id: "food1", label: "피자", img: AirpodsImg },
      { id: "food2", label: "초밥", img: PlaneImg },
      { id: "food3", label: "샐러드", img: FreedomImg },
    ],
  },
  activity: {
    headerText: <>김은삼님을 위한 <span>활동</span> 추천 결과입니다!</>,
    resultData: [
      { id: "activity1", label: "등산", img: AirpodsImg },
      { id: "activity2", label: "러닝", img: PlaneImg },
      { id: "activity3", label: "요가", img: FreedomImg },
    ],
  },
  funny: {
    headerText: <>김은삼님을 위한 <span>재미</span> 추천 결과입니다!</>,
    resultData: [
      { id: "funny1", label: "밈", img: AirpodsImg },
      { id: "funny2", label: "유머", img: PlaneImg },
      { id: "funny3", label: "농담", img: FreedomImg },
    ],
  },
};

const Container = styled.div`
  background: #fff;
  min-height: 100%;
  font-family: 'Pretendard', sans-serif;
  overflow: hidden;
`;

const Main = styled.main`
  margin: 0 auto;
  padding: 48px 0 0 0;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 36px;
  margin-top: 18px;
`;

const RecommandResultTemplate: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [tab, setTab] = useState<LeftTabKey>("basic");

  // 잘못된 카테고리 접근 시 리다이렉트
  if (!category || !CATEGORY_CONFIG[category]) {
    return <Navigate to="/recommend" replace />;
  }

  const { headerText, resultData } = CATEGORY_CONFIG[category];

  return (
    <Container>
      <Main>
        <RecommandResultHeader headerText={headerText} />
        <ContentRow>
          <RecommandMenu tab={tab} setTab={setTab} />
          <RecommandResultGrid resultData={resultData} />
        </ContentRow>
      </Main>
      <RetryButton />
    </Container>
  );
};

export default RecommandResultTemplate;
