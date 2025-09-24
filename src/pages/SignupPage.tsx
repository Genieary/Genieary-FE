import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CheckCircleFilled from "../components/Icons/CheckCircleFilled";


const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  // useAuth가 signup/checkEmail을 제공하지 않아도 작동하도록 any 캐스팅
  const auth = (useAuth() as any) || {};
  const loading: boolean = auth.loading ?? false;
  const serverError: string | undefined = auth.error;

  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState<null | boolean>(null);
  const [emailCheckMsg, setEmailCheckMsg] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [agree, setAgree] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const emailValid = useMemo(
    () =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const pwRule = useMemo(() => {
    const len = password.length >= 8;
    const mix = /[A-Za-z]/.test(password) && /\d/.test(password);
    return { len, mix, ok: len && mix };
  }, [password]);

  const pwMatch: boolean =
    !!password && !!password2 && password === password2;
  const canSubmit =
    emailValid && emailChecked === true && pwRule.ok && pwMatch && agree && !loading;

  const handleCheckEmail = async () => {
    setLocalError(null);
    setEmailChecked(null);
    setEmailCheckMsg("");

    if (!emailValid) {
      setEmailChecked(false);
      setEmailCheckMsg("유효한 이메일을 입력하세요.");
      return;
    }

    try {
      // 실제 API/hook이 있으면 사용
      if (typeof auth.checkEmail === "function") {
        const ok: boolean = await auth.checkEmail(email.trim());
        setEmailChecked(ok);
        setEmailCheckMsg(ok ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
      } else {
        // 임시 스텁 로직: example.com 이면 중복으로 처리
        await new Promise((r) => setTimeout(r, 400));
        const ok = !/@example\.com$/i.test(email.trim());
        setEmailChecked(ok);
        setEmailCheckMsg(ok ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
      }
    } catch (e) {
      setEmailChecked(false);
      setEmailCheckMsg("중복확인 중 오류가 발생했어요.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!emailValid) return setLocalError("이메일 형식을 확인하세요.");
    if (emailChecked !== true) return setLocalError("이메일 중복확인을 완료하세요.");
    if (!pwRule.ok) return setLocalError("비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다.");
    if (!pwMatch) return setLocalError("비밀번호 확인이 일치하지 않습니다.");
    if (!agree) return setLocalError("이용약관 동의가 필요합니다.");

    try {
      if (typeof auth.signup === "function") {
        const ok: boolean = await auth.signup({ email: email.trim(), password });
        if (!ok) throw new Error("회원가입 실패");
      } else {
        // 임시 스텁
        await new Promise((r) => setTimeout(r, 500));
      }
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate("/login");
    } catch (err: any) {
      setLocalError(err?.message || "회원가입 중 오류가 발생했어요.");
    }
  };

  return (
    <Page>
      <Title>회원가입</Title>

      <Card>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailChecked(null);
                setEmailCheckMsg("");
              }}
              disabled={loading}
            />
            <InlineBtn
              type="button"
              onClick={handleCheckEmail}
              disabled={loading || !emailValid}
            >
              중복확인
            </InlineBtn>
          </Field>
          {emailCheckMsg && (
            <Hint $ok={emailChecked === true}>{emailCheckMsg}</Hint>
          )}

          <Field>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Field>

          <Field>
            <Input
              type="password"
              placeholder="비밀번호를 다시 한 번 입력하세요"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              disabled={loading}
            />
          </Field>
          {password2 !== "" && (
            <Hint $ok={pwMatch}>{pwMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}</Hint>
          )}

          <AgreementLabel htmlFor="tosAgree" $disabled={loading}>
            <HiddenCheckbox
                id="tosAgree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                disabled={loading}
            />
            <IconWrap $checked={agree} $disabled={loading}>
                <CheckCircleFilled />
            </IconWrap>
            <span>이용약관 동의</span>
          </AgreementLabel>

          <TermsBox aria-label="이용약관 전문" tabIndex={0}>
            <TermsInner>{`지니어리 이용약관
제1조 (목적)
본 약관은 주식회사 ○○○(이하 "회사")가 운영하는 "지니어리(Genieary)" 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
"서비스"란, 이용자가 다양한 콘텐츠 및 기능을 통해 지식 탐색, 창의적 활동, 커뮤니케이션 등을 할 수 있도록 회사가 제공하는 Genieary 웹사이트 및 애플리케이션 일체를 의미합니다.
"회원"이란, 본 약관에 동의하고 서비스에 가입하여 회사가 제공하는 서비스를 이용하는 자를 말합니다.
"콘텐츠"란, 텍스트, 이미지, 음성, 영상 등 서비스 내에서 생성되거나 제공되는 일체의 자료를 의미합니다.

제3조 (약관의 게시와 개정)
회사는 본 약관의 내용을 회원이 쉽게 확인할 수 있도록 서비스 초기화면 또는 별도의 연결화면에 게시합니다.
회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 최소 7일 전 공지합니다.
회원이 개정된 약관에 명시적으로 동의하지 않는 경우, 회사는 회원의 서비스 이용을 제한하거나 회원 자격을 해지할 수 있습니다.

제4조 (서비스의 이용)
회사는 회원에게 지니어리를 통해 다양한 콘텐츠 생성, 저장, 공유 기능 및 개인 맞춤형 지능형 기능을 제공합니다.
서비스는 연중무휴, 1일 24시간 제공됨을 원칙으로 하나, 시스템 점검 등 사유가 있을 경우 일시 중단될 수 있습니다.
회사는 서비스의 품질 향상과 기능 개선을 위해 정기 또는 비정기 업데이트를 시행할 수 있습니다.

제5조 (회원의 의무)
회원은 관계 법령, 본 약관, 이용안내 및 서비스와 관련하여 공지한 사항을 준수하여야 하며, 다음 행위를 하여서는 안 됩니다.
- 타인의 개인정보를 도용하거나 허위 정보를 입력하는 행위
- 서비스 내 게시된 콘텐츠를 무단 복제, 배포, 변형하는 행위
- 회사의 운영을 방해하거나 시스템에 과부하를 일으키는 행위
- 법령에 위반되거나 공공질서 및 미풍양속에 반하는 행위
회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 계정 도용으로 인한 책임은 회원에게 있습니다.

제6조 (지식 재산권)
서비스 내 모든 콘텐츠에 대한 저작권 및 지식재산권은 회사 또는 정당한 권리를 보유한 자에게 귀속됩니다.
회원이 서비스 내에 게시하거나 등록한 콘텐츠의 저작권은 해당 회원에게 있으나, 회사는 서비스 운영, 홍보 등의 목적으로 이를 무상으로 사용할 수 있습니다.
회사는 회원이 게시한 콘텐츠가 타인의 권리를 침해하거나 법령에 위반되는 경우 사전 통지 없이 삭제할 수 있습니다.

제7조 (계정의 해지 및 제한)
회원은 언제든지 서비스 내 제공되는 절차를 통해 이용계약을 해지할 수 있습니다.
회사는 다음 각 호의 사유가 있는 경우 사전 통지 없이 계정을 일시 정지하거나 해지할 수 있습니다.
- 본 약관 위반
- 타인에게 피해를 주는 악의적인 활동
- 시스템 보안에 위협이 되는 행위

제8조 (면책조항)
회사는 천재지변, 시스템 오류, 통신 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
회사는 회원이 서비스 이용을 통해 기대하는 결과를 보장하지 않습니다.
회사는 회원이 서비스에 게시한 정보, 자료, 사실의 신뢰도 및 정확성에 대해 책임을 지지 않습니다.

제9조 (준거법 및 재판관할)
본 약관은 대한민국 법률에 따라 해석 및 적용됩니다.
회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법상 관할 법원에 제기합니다.

부칙
본 약관은 2025년 6월 25일부터 시행합니다.`}</TermsInner>
          </TermsBox>

          {(localError || serverError) && (
            <ErrorText>{localError || serverError}</ErrorText>
          )}

          <Submit type="submit" disabled={!canSubmit}>
            회원가입
          </Submit>
        </Form>
      </Card>
    </Page>
  );
};

export default SignupPage;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  background: #fff;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 900;
  color: #333;
  margin-bottom: 20px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
`;

const LeftAvatar = styled.div`
  position: absolute; left: -24px; top: 140px;
  display: flex; align-items: center; gap: 8px;
`;
const RightAvatar = styled.div`
  position: absolute; right: -22px; top: 240px;
`;
const AvatarCircle = styled.div`
  width: 56px; height: 56px; border-radius: 50%;
  background: #e9d8fd; display:flex; align-items:center; justify-content:center;
  font-size: 22px;
`;
const CheckDot = styled.div`
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid #5b9cff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  padding-right: 96px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color .2s;
  background: rgb(247, 246, 246);
  &:focus { border-color: #007bff; }
  &::placeholder { color: #999; }
`;

const InlineBtn = styled.button`
  position: absolute;
  right: 6px; top: 6px;
  height: 30px; padding: 0 12px;
  border: 1px solid #e1e1e1;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
`;

const Hint = styled.div<{ $ok?: boolean }>`
  font-size: 13px;
  color: ${({ $ok }) => ($ok ? "#2b8a3e" : "#d14343")};
  margin-top: -6px;
`;

const TermsBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  height: 120px;
  overflow: auto;
  padding: 10px 12px;
`;

const TermsInner = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: keep-all;
  font-size: 13px;
  color: #444;
  line-height: 1.6;
`;

const ErrorText = styled.div`
  color: #ff4757;
  font-size: 14px;
`;

const Submit = styled.button<{disabled?: boolean}>`
  margin-top: 6px;
  width: 220px;
  padding: 14px;
  background: ${({disabled}) => (disabled ? "#a7c5ff" : "#2b6cff")};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: ${({disabled}) => (disabled ? "not-allowed" : "pointer")};
  transition: background .2s;
  align-self: center;
  &:hover { background: ${({disabled}) => (disabled ? "#a7c5ff" : "#1f55d6")}; }
`;

const AgreementLabel = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #555;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0; height: 0;
  pointer-events: none;
`;

const IconWrap = styled.span<{ $checked: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  color: ${({ $checked }) => ($checked ? "#2b6cff" : "#757575")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: color .15s ease, transform .1s ease;
  ${AgreementLabel}:active & { transform: scale(0.96); }
`;