import React, { useMemo, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

type CategoryKey =
  | "푸드·드링크"
  | "실내 활동"
  | "자기계발"
  | "재테크"
  | "액티비티"
  | "문화·예술"
  | "소셜게임"
  | "여행·나들이";

const CATEGORIES: { key: CategoryKey; label: string; items: string[] }[] = [
  {
    key: "푸드·드링크",
    label: "푸드·드링크",
    items: ["맛집 투어", "요리", "주류", "베이킹", "디저트", "커피", "파인다이닝", "티"],
  },
  {
    key: "실내 활동",
    label: "실내 활동",
    items: [
      "사진",
      "드로잉",
      "댄스",
      "공예",
      "노래",
      "악기 연주",
      "글쓰기",
      "봉사",
      "음악 감상",
      "향수",
      "뷰티",
      "쇼핑",
      "영상",
      "캘리그라피",
      "만화",
    ],
  },
  {
    key: "자기계발",
    label: "자기계발",
    items: ["독서", "스터디", "스피치", "커리어", "브랜딩", "창작", "외국어"],
  },
  {
    key: "재테크",
    label: "재테크",
    items: ["투자금융", "부동산", "창업", "주식", "경제", "블로그", "SNS"],
  },
  {
    key: "액티비티",
    label: "액티비티",
    items: [
      "등산",
      "야구",
      "산책",
      "스포츠관람",
      "러닝",
      "클라이밍",
      "요가",
      "다이어트",
      "헬스",
      "테니스",
      "배드민턴",
      "자전거",
      "풋살",
      "볼링",
      "농구",
      "필라테스",
      "골프",
      "수영",
      "축구",
      "스케이트보드",
      "수상스포츠",
    ],
  },
  {
    key: "소셜게임",
    label: "소셜게임",
    items: ["보드게임", "컨셉게임", "추리게임", "방탈출", "온라인게임"],
  },
  {
    key: "문화·예술",
    label: "문화·예술",
    items: ["전시", "영화", "페스티벌", "연극", "뮤지컬", "공연", "콘서트", "연주회", "팝업"],
  },
  {
    key: "여행·나들이",
    label: "여행·나들이",
    items: ["국내 여행", "피크닉", "해외 여행", "캠핑", "드라이브", "놀이공원"],
  },
];

const MAX_SELECT = 5;

/* ===== 페이지 ===== */
const OnboardingInterestsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 1단계에서 넘긴 state 필요하면 사용
  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const isFull = selected.length >= MAX_SELECT;

  const toggleOpen = (key: CategoryKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const toggleItem = useCallback((name: string) => {
  setSelected(prev =>
    prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
  );
}, []);


  const handleNext = () => {
    if (selected.length === 0) {
      setErrorMsg(`관심 항목을 최소 1개 선택해 주세요. (최대 ${MAX_SELECT}개)`);
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
      return;
    }
    // TODO: 서버 전송 or 전역 저장
    // 예시로 메인으로 이동
    navigate("/");
  };

  const selectedChips = useMemo(
  () =>
    selected.map((s) => (
      <SelChip key={s} onClick={() => toggleItem(s)} title="클릭하여 제거">
        {s}
      </SelChip>
    )),
  [selected, toggleItem]
);

  return (
    <Page>
      <Title>서비스 이용 전 정보를 입력해주세요!</Title>

      <Card>
        <SectionHead>
          <strong>취미 및 관심 카테고리</strong>
          <span>(최대 {MAX_SELECT}개 선택)</span>
        </SectionHead>

        <Accordions>
          {CATEGORIES.map(({ key, label, items }) => {
            const opened = openKey === key;
            return (
              <AccItem key={key}>
                <AccHeader onClick={() => toggleOpen(key)} $opened={opened}>
                  <span>{label}</span>
                  <Caret $opened={opened} aria-hidden />
                </AccHeader>

                {opened && (
                  <AccBody>
                    <ChipsWrap>
                      {items.map((name) => {
                        const active = selected.includes(name);
                        const disabled = !active && isFull;
                        return (
                          <Chip
                            key={name}
                            $active={active}
                            $disabled={disabled}
                            onClick={() => !disabled && toggleItem(name)}
                            title={disabled ? `최대 ${MAX_SELECT}개까지 선택 가능합니다.` : ""}
                          >
                            {name}
                          </Chip>
                        );
                      })}
                    </ChipsWrap>
                  </AccBody>
                )}
              </AccItem>
            );
          })}
        </Accordions>

        <ChosenWrap>
          <ChosenTitle>선택된 항목:</ChosenTitle>
          <ChosenChips>{selected.length ? selectedChips : <Hint>아직 선택한 항목이 없어요</Hint>}</ChosenChips>
        </ChosenWrap>
      </Card>

      {errorMsg && (
        <ErrorBanner ref={errorRef} role="alert" aria-live="assertive">
          <ErrorDot />
          <span>{errorMsg}</span>
          <CloseBtn onClick={() => setErrorMsg(null)} aria-label="안내 닫기">
            ✕
          </CloseBtn>
        </ErrorBanner>
      )}

      <NextButton onClick={handleNext}>다음</NextButton>
    </Page>
  );
};

export default OnboardingInterestsPage;

const Page = styled.div`
  padding: 48px 32px 120px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: 900;
  margin: 20px 0 28px;
  color: #111;
`;

const Card = styled.div`
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  padding: 28px 28px 32px;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;

  strong {
    font-size: 16px;
    font-weight: 800;
    color: #222;
  }
  span {
    font-size: 12px;
    color: #9aa0a6;
  }
`;

const Accordions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AccItem = styled.div``;

const AccHeader = styled.button<{ $opened?: boolean }>`
  width: 100%;
  background: transparent;
  border: none;
  color: #2b2b2b;
  font-weight: 700;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: #fafbff;
  }
`;

const Caret = styled.span<{ $opened?: boolean }>`
  width: 16px;
  height: 16px;
  display: inline-block;
  border-right: 2px solid #9aa0a6;
  border-bottom: 2px solid #9aa0a6;
  transform: rotate(${({ $opened }) => ($opened ? "-135deg" : "45deg")});
  transition: transform 0.15s ease;
  margin-left: 8px;
`;

const AccBody = styled.div`
  padding: 6px 0 14px 0;
`;

const ChipsWrap = styled.div`
    display: grid;
    grid-template-columns: repeat(6, max-content);
    gap: 10px 12px;
    justify-content: start;
    align-content: start;
`;

const Chip = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 8px 14px;
  border-radius: 18px;
  border: 1.5px solid ${({ $active }) => ($active ? "#3fb97f" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#e9f7ef" : "#f6f7fb")};
  color: ${({ $active }) => ($active ? "#2b8a3e" : "#333")};
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled, $active }) => ($disabled && !$active ? 0.6 : 1)};
`;

const ChosenWrap = styled.div`
  margin-top: 18px;
`;

const ChosenTitle = styled.div`
  font-weight: 800;
  color: #2b2b2b;
  margin-bottom: 10px;
`;

const ChosenChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
`;

const SelChip = styled.button`
  padding: 8px 14px;
  border-radius: 18px;
  background: #e9f7ef;
  border: 1.5px solid #3fb97f;
  color: #2b8a3e;
  font-weight: 800;
  cursor: pointer;
`;

const Hint = styled.span`
  color: #9aa0a6;
  font-size: 14px;
`;

const NextButton = styled.button`
  position: fixed;
  right: 48px;
  bottom: 48px;
  min-width: 160px;
  padding: 16px 26px;
  background: #2b6cff;
  color: #fff;
  border: none;
  border-radius: 18px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(43, 108, 255, 0.25);
`;

const ErrorBanner = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 28px;
  max-width: min(720px, 92vw);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fff1f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  z-index: 50;
`;

const ErrorDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  flex: 0 0 10px;
`;

const CloseBtn = styled.button`
  margin-left: 8px;
  border: none;
  background: transparent;
  color: #b91c1c;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
`;
