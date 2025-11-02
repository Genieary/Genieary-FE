import React, { useState } from "react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeartDefaultIcon from "../../assets/heart-default.svg";
import HeartLikedIcon from "../../assets/heart-liked.svg";
import BrokenHeartDefaultIcon from "../../assets/broken-heart-default.svg";
import BrokenHeartDislikedIcon from "../../assets/broken-heart-disliked.svg";

export interface ResultItem {
  id: string;
  label: string;
  img: string;
}

type LikeStatus = "liked" | "disliked" | "none";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  padding: 80px 18px 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const ResultImage = styled.img`
  width: 180px;
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
  width: 28px;
  height: 28px;
  transition: transform 0.15s ease;
  &:active {
    transform: scale(1.2);
  }
`;

interface Props {
  resultData: ResultItem[];
}

const RecommandResultGrid: React.FC<Props> = ({ resultData }) => {
  const [likeStatus, setLikeStatus] = useState<Record<string, LikeStatus>>({});

  const token = localStorage.getItem("accessToken");

  const handleLike = async (id: string) => {
    const status = likeStatus[id] || "none";

    if (status === "disliked") {
      toast.warning("싫어요를 먼저 취소해야 좋아요를 누를 수 있어요.", { autoClose: 1800 });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/recommend/${id}/like`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("like 요청 실패");

      const newStatus = status === "liked" ? "none" : "liked";
      setLikeStatus((prev) => ({ ...prev, [id]: newStatus }));

      toast.success(
        newStatus === "liked" ? "좋아요가 저장되었습니다." : "좋아요가 취소되었습니다.",
        { autoClose: 1500 }
      );
    } catch {
      toast.error("좋아요 처리 중 오류가 발생했습니다.", { autoClose: 1500 });
    }
  };

  const handleDislike = async (id: string) => {
    const status = likeStatus[id] || "none";

    if (status === "liked") {
      toast.warning("좋아요를 먼저 취소해야 싫어요를 누를 수 있어요.", { autoClose: 1800 });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/recommend/${id}/dislike`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("dislike 요청 실패");

      const newStatus = status === "disliked" ? "none" : "disliked";
      setLikeStatus((prev) => ({ ...prev, [id]: newStatus }));

      toast.success(
        newStatus === "disliked" ? "싫어요가 저장되었습니다." : "싫어요가 취소되었습니다.",
        { autoClose: 1500 }
      );
    } catch {
      toast.error("싫어요 처리 중 오류가 발생했습니다.", { autoClose: 1500 });
    }
  };

  return (
    <ResultGridContainer>
      {resultData.map((item) => {
        const status = likeStatus[item.id] || "none";
        const isLiked = status === "liked";
        const isDisliked = status === "disliked";

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
                  <IconImage
                    src={isDisliked ? BrokenHeartDislikedIcon : BrokenHeartDefaultIcon}
                    alt="싫어요"
                  />
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
