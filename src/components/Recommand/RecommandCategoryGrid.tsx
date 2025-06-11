import React, { useState } from "react";
import styled, { css } from "styled-components";
import Activity from "../../assets/activity.svg";
import Food from "../../assets/food.svg";
import Gift from "../../assets/gift.svg";
import Funny from "../../assets/funny.svg";

// 카테고리 타입
export type Category = "선물" | "음식" | "활동" | "재미";

const categories: { key: Category; label: string; icon: string }[] = [
  { key: "선물", label: "선물", icon: Gift },
  { key: "음식", label: "음식", icon: Food },
  { key: "활동", label: "활동", icon: Activity },
  { key: "재미", label: "재미", icon: Funny },
];

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 52px;
  width: 560px;
`;

interface CategoryCardProps {
  selected?: boolean;
}
const CategoryCard = styled.button<CategoryCardProps>`
  background: #f8f9fa;
  border: none;
  border-radius: 13px;
  padding: 32px 0;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: background 0.18s, box-shadow 0.18s;

  ${({ selected }) =>
    selected &&
    css`
      background: #D2F9D9;
      box-shadow: 0 4px 16px rgba(43,138,74,0.09);
    `
  }

  &:hover {
    ${({ selected }) =>
      !selected &&
      css`
        background: #E0E6FF;
        box-shadow: 0 4px 16px rgba(79,70,229,0.09);
      `
    }
  }
`;

const CategoryIcon = styled.img<{ $hovered?: boolean; $selected?: boolean }>`
  margin-bottom: 8px;
  width: 38px;
  height: 38px;
  transition: filter 0.18s;

  ${({ $selected }) =>
    $selected &&
    css`
      filter: brightness(0) saturate(100%) invert(41%) sepia(84%) saturate(413%) hue-rotate(84deg) brightness(92%) contrast(97%);
      /* #2B8A4A */
    `
  }

  ${({ $hovered, $selected }) =>
    $hovered && !$selected &&
    css`
      filter: brightness(0) saturate(100%) invert(51%) sepia(83%) saturate(553%) hue-rotate(199deg) brightness(97%) contrast(90%);
      /* #4A6CF6 */
    `
  }
`;

const CategoryLabel = styled.div<{ $hovered?: boolean; $selected?: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  transition: color 0.18s;

  ${({ $selected }) =>
    $selected &&
    css`
      color: #2B8A4A;
    `
  }

  ${({ $hovered, $selected }) =>
    $hovered && !$selected &&
    css`
      color: #4A6CF6;
    `
  }
`;

// 추천받기 버튼 (우측 하단 고정, > 문자 사용)
const RecommendButtonFixed = styled.button`
  position: fixed;
  right: 150px;
  bottom: 125px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 5px;
  background: #fdf8ea;
  border: 2.5px solid #ff9900;
  color: #ff9900;
  font-weight: 800;
  font-size: 1.2rem;
  padding: 10px 32px 10px 24px;
  border-radius: 30px;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  transition: background 0.15s, color 0.15s, border 0.15s;

  &:hover {
    background: #fff3d1;
    border-color: #ff9900;
    color: #ff9900;
  }
`;

const RecommendButtonArrow = styled.span`
  font-size: 1.5rem;
  font-weight: 900;
  color: #ff9900;
  display: flex;
  align-items: center;
  margin-right: 4px;
  margin-top: 1px;
`;

const RecommandCategoryGrid: React.FC = () => {
  const [selected, setSelected] = useState<Category | null>(null);
  const [hovered, setHovered] = useState<Category | null>(null);

  return (
    <>
      <CategoryGrid>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            selected={selected === cat.key}
            onClick={() => setSelected(cat.key)}
            onMouseEnter={() => setHovered(cat.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <CategoryIcon
              src={cat.icon}
              alt={cat.label}
              $hovered={hovered === cat.key}
              $selected={selected === cat.key}
            />
            <CategoryLabel
              $hovered={hovered === cat.key}
              $selected={selected === cat.key}
            >
              {cat.label}
            </CategoryLabel>
          </CategoryCard>
        ))}
      </CategoryGrid>
      {selected && (
        <RecommendButtonFixed>
          <RecommendButtonArrow>&gt;</RecommendButtonArrow>
          <span style={{fontWeight: 800, fontSize: "1.12rem"}}>추천받기</span>
        </RecommendButtonFixed>
      )}
    </>
  );
};

export default RecommandCategoryGrid;
