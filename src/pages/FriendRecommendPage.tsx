// src/pages/FriendRecommendPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled from "styled-components";
import RecommandResultHeader from "../components/Recommand/RecommandResultHeader";
import RecommandMenu, { LeftTabKey } from "../components/Recommand/RecommandMenu";
import RecommandResultGrid, { ResultItem } from "../components/Recommand/RecommandResultGrid";
import RetryButton from "../components/Recommand/RetryButton";
import { getFriendGiftRecommendations } from "../api/recommendApi";
import { getFriendProfile } from "../api/friendApi";

const Container = styled.div`
  background: #fff;
  min-height: 100%;
  font-family: "Pretendard", sans-serif;
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

const FriendRecommendPage: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const [tab, setTab] = useState<LeftTabKey>("friend");
  const [nickname, setNickname] = useState("친구");
  const [resultData, setResultData] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  /** ✅ 친구 프로필(닉네임) 불러오기 */
  const fetchFriendProfile = async () => {
    if (!friendId) return;
    try {
      const res = await getFriendProfile(Number(friendId));
      setNickname(res.result.nickname);
    } catch (err) {
      console.warn("친구 닉네임 불러오기 실패:", err);
    }
  };

  /** ✅ 친구 맞춤 추천 불러오기 */
  const fetchFriendRecommendations = async () => {
    if (!friendId) return;
    setLoading(true);
    try {
      const recRes = await getFriendGiftRecommendations(Number(friendId));
      const items: ResultItem[] = (recRes ?? []).map((r: any) => ({
        id: r.recommendId ?? r.id,
        label: r.name,
        img: r.imageUrl ?? "/images/placeholder.png",
      }));
      setResultData(items);
    } catch (err) {
      console.error("친구 추천 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendProfile();
    fetchFriendRecommendations();
  }, [friendId]);

  if (!friendId) return <Navigate to="/recommend" replace />;

  return (
    <Container>
      <Main>
        {/* ✅ 상단 제목 */}
        <RecommandResultHeader
          headerText={
            <>
              {nickname}님을 위한 <span>선물</span> 추천 결과입니다!
            </>
          }
        />

        {/* ✅ 콘텐츠 행 (사이드바 + 결과) */}
        <ContentRow>
          <RecommandMenu tab={tab} setTab={setTab} />
          {loading ? (
            <p>불러오는 중...</p>
          ) : (
            <RecommandResultGrid resultData={resultData} showActions={false} />
          )}
        </ContentRow>
      </Main>

      {/* ✅ 재추천 버튼 */}
      <RetryButton onClick={fetchFriendRecommendations} />
    </Container>
  );
};

export default FriendRecommendPage;
