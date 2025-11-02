// src/pages/RecommandResultTemplate.tsx
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled from "styled-components";
import RecommandResultHeader from "../components/Recommand/RecommandResultHeader";
import RecommandMenu, { LeftTabKey } from "../components/Recommand/RecommandMenu";
import RecommandResultGrid, { ResultItem } from "../components/Recommand/RecommandResultGrid";
import RetryButton from "../components/Recommand/RetryButton";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const Container = styled.div`
  background: #fff;
  min-height: 100%;
  font-family: 'Pretendard', sans-serif;
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

const CATEGORY_MAP: Record<string, string> = {
  gift: "GIFT",
  food: "FOOD",
  activity: "ACTIVITY",
  funny: "FUNNY",
};

const CATEGORY_LABEL: Record<string, string> = {
  gift: "선물",
  food: "음식",
  activity: "활동",
  funny: "재미",
};

const RecommandResultTemplate: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [tab, setTab] = useState<LeftTabKey>("basic");
  const [nickname, setNickname] = useState("사용자");
  const [resultData, setResultData] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  /** ✅ 유저 프로필 불러오기 */
const fetchUserInfo = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("⚠️ no token found in localStorage");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("➡️ /api/users/profile status:", res.status);
    const json = await res.json();
    console.log("✅ user info response:", json);

    // 🔹 응답 구조에서 result.nickname 추출
    const nickname = json?.result?.nickname;
    if (nickname) {
      setNickname(nickname);
    } else {
      console.warn("⚠️ nickname not found in response");
    }
  } catch (err) {
    console.warn("닉네임 불러오기 실패:", err);
  }
};

  /** ✅ 추천 결과 불러오기 */
  const fetchRecommendations = async () => {
    if (!category || !CATEGORY_MAP[category]) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${API_BASE}/recommend?category=${CATEGORY_MAP[category]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const json = await res.json();
      console.log("✅ recommend result:", json);

      const items: ResultItem[] = (json.result ?? []).map((r: any) => ({
        id: r.recommendId,
        label: r.name,
        img: r.imageUrl ?? "/images/placeholder.png",
      }));

      setResultData(items);
    } catch (err) {
      console.error("추천 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 최초 실행 */
  useEffect(() => {
    fetchUserInfo();
    fetchRecommendations();
  }, [category]);

  if (!category || !CATEGORY_MAP[category]) return <Navigate to="/recommend" replace />;

  return (
    <Container>
      <Main>
        <RecommandResultHeader
          headerText={
            <>
              {nickname}님을 위한 <span>{CATEGORY_LABEL[category]}</span> 추천 결과입니다!
            </>
          }
        />
        <ContentRow>
          <RecommandMenu tab={tab} setTab={setTab} />
          {loading ? (
            <p>불러오는 중...</p>
          ) : (
            <RecommandResultGrid resultData={resultData} />
          )}
        </ContentRow>
      </Main>

      {/* ✅ 재추천 버튼 */}
      <RetryButton onClick={fetchRecommendations} />
    </Container>
  );
};

export default RecommandResultTemplate;
