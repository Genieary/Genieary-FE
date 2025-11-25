import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserApi } from "../api/userApi";
import { toast } from "react-toastify";
import { koreanToPersonality, PERSONALITY_KEYWORDS } from "../utils/personalityUtils";

const GENDER_OPTIONS = ["선택안함", "남자", "여자"] as const;
const KEYWORDS = PERSONALITY_KEYWORDS;
const MAX_KEYWORDS = 3;

const OnboardingProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [gender, setGender] = useState<null | typeof GENDER_OPTIONS[number]>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  // 숫자만 입력 + 길이 제한
  const onlyDigits = (v: string) => v.replace(/\D/g, "");
  const onYear = (v: string) => setYear(onlyDigits(v).slice(0, 4));
  const onMonth = (v: string) => setMonth(onlyDigits(v).slice(0, 2));
  const onDay = (v: string) => setDay(onlyDigits(v).slice(0, 2));

  const toggleKeyword = (word: string) => {
    setKeywords((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word);
      if (prev.length >= MAX_KEYWORDS) return prev; // 최대 3개
      return [...prev, word];
    });
  };

  // 간단 유효성 (월 1~12, 일 1~31만 체크)
  const birthdayValid = useMemo(() => {
    const y = Number(year), m = Number(month), d = Number(day);
    if (year.length !== 4 || month.length < 1 || day.length < 1) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    return true;
  }, [year, month, day]);

  const allValid =
    nickname.trim().length > 0 &&
    birthdayValid &&
    gender !== null && 
    keywords.length > 0 &&
    keywords.length <= MAX_KEYWORDS;

  
  const handleNext = async () => {
    if (!allValid) {
      const missing: string[] = [];
      if (!nickname.trim()) missing.push("닉네임");
      if (!birthdayValid) missing.push("생일");
      if (gender === null) missing.push("성별");
      if (keywords.length === 0) missing.push("성격 키워드");
      toast.error(
        `다음 항목을 확인해 주세요:\n${missing.map((m) => `• ${m}`).join("\n")}\n(성격 키워드는 최대 ${MAX_KEYWORDS}개 선택)`,
        { autoClose: 4000 }
      );
      return;
    }
  
    try {
      const userApi = new UserApi();
  
      const birthDate = `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      let genderValue: "MALE" | "FEMALE" | "OTHER" = "OTHER";
      if (gender === "남자") genderValue = "MALE";
      if (gender === "여자") genderValue = "FEMALE";
  
      const personalities = keywords.map((k) => koreanToPersonality[k]);
  
      await userApi.createProfile({
        nickname: nickname.trim(),
        birthDate,
        gender: genderValue,
        personalities,
      });
      navigate("/onboarding/interests"); // 2단계로 이동
    } catch (err: any) {
      toast.error(err.message || "프로필 등록 중 오류가 발생했습니다.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <Page>
      <Title>서비스 이용 전 정보를 입력해주세요!</Title>

      <Card>
        <RightAlign>
        <Row>
          <Label>닉네임</Label>
          <Field>
            <NickInput
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              $ok={nickname.trim().length > 0}
            />
          </Field>
        </Row>

        <Row>
          <Label>생일</Label>
          <Field>
            <BirthdayWrap>
              <ChipInput
                inputMode="numeric"
                placeholder="YYYY"
                value={year}
                onChange={(e) => onYear(e.target.value)}
                $w="84px"
              />
              <ChipInput
                inputMode="numeric"
                placeholder="MM"
                value={month}
                onChange={(e) => onMonth(e.target.value)}
                $w="68px"
              />
              <ChipInput
                inputMode="numeric"
                placeholder="DD"
                value={day}
                onChange={(e) => onDay(e.target.value)}
                $w="68px"
              />
            </BirthdayWrap>
          </Field>
        </Row>

        <Row>
          <Label>성별</Label>
          <Field>
            <Chips>
              {GENDER_OPTIONS.map((g) => (
                <ChoiceChip
                  key={g}
                  $selected={gender === g}
                  onClick={() => setGender(g)}
                >
                  {g}
                </ChoiceChip>
              ))}
            </Chips>
          </Field>
        </Row>

        <Row $alignStart>
          <LabelBlock>
            <div>성격키워드</div>
            <SubNote>(최대 {MAX_KEYWORDS}개 선택)</SubNote>
          </LabelBlock>
          <Field>
            <ChipsWrap>
              {KEYWORDS.map((w) => {
                const selected = keywords.includes(w);
                const disabled = !selected && keywords.length >= MAX_KEYWORDS;
                return (
                  <KeywordChip
                    key={w}
                    $selected={selected}
                    $disabled={disabled}
                    onClick={() => toggleKeyword(w)}
                  >
                    {w}
                  </KeywordChip>
                );
              })}
            </ChipsWrap>
          </Field>
        </Row>
        </RightAlign>
      </Card>

      <NextButton onClick={handleNext}>다음</NextButton>
    </Page>
  );
};

export default OnboardingProfilePage;

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
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  padding: 28px 28px 24px;
`;

const RightAlign = styled.div`
  max-width: 680px;
  width: 100%;
  margin-left: auto;
`;

const Row = styled.div<{ $alignStart?: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: ${({ $alignStart }) => ($alignStart ? "flex-start" : "center")};
  & + & { margin-top: 18px; }
`;

const Label = styled.div`
  text-align: right;
  font-weight: 700;
  color: #2b2b2b;
  line-height: 36px;
`;

const Field = styled.div``;

const LabelBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 레이블 컬럼은 오른쪽 정렬 유지 */
  gap: 4px;
  color: #2b2b2b;
  font-weight: 700;
  line-height: 1.2;
`;

const SubNote = styled.small`
  font-weight: 500;
  color: #9aa0a6;
  font-size: 12px;
`;

const NickInput = styled.input<{ $ok?: boolean }>`
  width: 100%;
  max-width: 300px;
  padding: 12px 16px;
  background: #f6f7fb;
  border: 1px solid ${({ $ok }) => ($ok ? "#3fb97f" : "#eef0f4")};
  border-radius: 12px;
  outline: none;
  font-size: 14px;
`;

const BirthdayWrap = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  max-width: 300px;
`;
const ChipInput = styled.input<{ $w: string }>`
  width: ${({ $w }) => $w};
  padding: 10px 14px;
  background: #f6f7fb;
  border: 1px solid #eef0f4;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  outline: none;
`;

const Chips = styled.div`
  display: flex;
  gap: 12px;
`;
const ChoiceChip = styled.button<{ $selected?: boolean }>`
  padding: 10px 16px;
  border-radius: 14px;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3fb97f" : "#e5e7eb")};
  background: ${({ $selected }) => ($selected ? "#e9f7ef" : "#f6f7fb")};
  color: ${({ $selected }) => ($selected ? "#2b8a3e" : "#333")};
  font-weight: 700;
  cursor: pointer;
`;

const ChipsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(5, max-content);
  gap: 12px;
  justify-items: start;
  align-content: start;
`;
const KeywordChip = styled.button<{ $selected?: boolean; $disabled?: boolean }>`
  padding: 10px 16px;
  border-radius: 18px;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3fb97f" : "#e5e7eb")};
  background: ${({ $selected }) => ($selected ? "#e9f7ef" : "#f6f7fb")};
  color: ${({ $selected }) => ($selected ? "#2b8a3e" : "#333")};
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled, $selected }) => ($disabled && !$selected ? 0.6 : 1)};
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
  box-shadow: 0 8px 24px rgba(43,108,255,.25);
`;
