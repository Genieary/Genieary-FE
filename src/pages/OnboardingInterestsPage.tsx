import React, { useMemo, useRef, useState, useCallback,useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { UserApi } from "../api/userApi"; 
import { toast } from "react-toastify";

const MAX_SELECT = 5;

/* ===== 페이지 ===== */
const OnboardingInterestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Record<string, { id: number; name: string }[]>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const errorRef = useRef<HTMLDivElement>(null);

  const isFull = selected.length >= MAX_SELECT;
  
  // 관심사 목록 불러오기
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const api = new UserApi();
        const categoryData = await api.getInterests();
        setCategories(categoryData);
      } catch (err: any) {
        console.error(err);
        setErrorMsg("관심사 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  const toggleOpen = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const toggleItem = useCallback((id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : prev.length < MAX_SELECT
        ? [...prev, id]
        : prev
    );
  }, []);

  const selectedChips = useMemo(() => {
    const allItems = Object.values(categories).flat();
    const selectedItems = allItems.filter((item) => selected.includes(item.id));
    return selectedItems.map((item) => (
      <SelChip key={item.id} onClick={() => toggleItem(item.id)} title="클릭하여 제거">
        {item.name}
      </SelChip>
    ));
  }, [selected, categories, toggleItem]);

  const handleNext = async () => {
    if (selected.length === 0) {
      setErrorMsg(`관심 항목을 최소 1개 선택해 주세요. (최대 ${MAX_SELECT}개)`);
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
      return;
    }

    try {
      const api = new UserApi();
      await api.createInterests({ interestIds: selected });
      toast.success("관심사가 등록되었습니다!");
      navigate("/"); 
    } catch (err: any) {
      setErrorMsg(err.message || "관심사 등록 중 오류가 발생했습니다.");
    }
  };
  if (loading) {
    return (
      <Page>
        <Title>관심사를 불러오는 중...</Title>
      </Page>
    );
  }

  return (
    <Page>
      <Title>서비스 이용 전 정보를 입력해주세요!</Title>

      <Card>
        <SectionHead>
          <strong>취미 및 관심 카테고리</strong>
          <span>(최대 {MAX_SELECT}개 선택)</span>
        </SectionHead>

        <Accordions>
          {Object.entries(categories).map(([key, items]) => {
            const opened = openKey === key;
            return (
              <AccItem key={key}>
                <AccHeader onClick={() => toggleOpen(key)} $opened={opened}>
                  <span>{key}</span>
                  <Caret $opened={opened} aria-hidden />
                </AccHeader>

                {opened && (
                  <AccBody>
                    <ChipsWrap>
                      {items.map(({ id, name }) => {
                        const active = selected.includes(id);
                        const disabled = !active && isFull;
                        return (
                          <Chip
                            key={id}
                            $active={active}
                            $disabled={disabled}
                            onClick={() => !disabled && toggleItem(id)}
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
