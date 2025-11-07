// src/pages/DiaryDetailPage.tsx
import { toPng } from 'html-to-image';
import React, { useEffect, useMemo, useRef, useState } from 'react'; // useRef 추가
import styled from 'styled-components';
import Holidays from '../components/Sidebar/Holidays';
import { dateKeyOf, useCalendar } from '../store/calendarStore';
import { createDiary, getDiaryByDate, getDiaryById, updateDiary, deleteDiary } from '../api/diaryApi';
import type { EventItem } from '../store/calendarStore';
import { getRecommendGifts } from '../api/recommendApi';
import { analyzeEmotionByUrl, getAnalysisByDiaryId, deleteAnalysisByDiaryId } from '../api/analysisApi';
import { formatDateForServer } from '../utils/dateUtils';
import { getPresignedUploadUrl, getDiaryFaceUrl } from '../api/diaryApi'; // 새로 추가 예정

// import {getDiaryFaceUrl}

interface DiaryDetailPageProps {
  selectedDate: Date;
  onBack: () => void;
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = ({ selectedDate, onBack }) => {
  const key = dateKeyOf(selectedDate);
  const captureRef = useRef<HTMLDivElement>(null);

  const {
    addEvent,
    updateEvent,
    deleteEvent,
    togglePinned,
    setDiary,
    getDiary,
    setPhoto,
    getPhoto,
    clearPhoto,
    getGifts,
    setGifts
  } = useCalendar();

  const [diaryContent, setDiaryContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const gifts= getGifts(key);
  const [diaryId, setDiaryId] = useState<number | null>(null);

  // 영어 감정 → 한글 + 이모지 매핑
const EMOTION_MAP: Record<string, { label: string; emoji: string }> = {
  happy: { label: '행복', emoji: '😊' },
  sad: { label: '슬픔', emoji: '😢' },
  angry: { label: '분노', emoji: '😠' },
  disgust: { label: '혐오', emoji: '🤢' },
  fear: { label: '두려움', emoji: '😨' },
  neutral: { label: '중립', emoji: '😐' },
  surprise: { label: '놀람', emoji: '😲' },
};


useEffect(() => {
  const fetchDiary = async () => {
    try {
      const formattedDate = formatDateForServer(selectedDate);
      const diary = await getDiaryByDate(formattedDate);

      if (diary) {
        console.log('📖 기존 일기 발견:', diary);
        setDiaryId(diary.diaryId);
        setDiaryContent(diary.content);
        setDiary(key, diary);   // store에 반영
        setIsEditing(false);

        // ✅ 얼굴 사진 Presigned 다운로드 URL 불러오기
        const face = await getDiaryFaceUrl(diary.diaryId);

        const analysis = await getAnalysisByDiaryId(diary.diaryId);

        if (face?.url) {
          setPhoto({
            date: key,
            imageDataUrl: face.url,
            summary: analysis?.analysis ?? "AI 분석 결과 없음",
            stats: analysis?.allPredictions ?? {},

          });
        }
      } else {
        console.log('🆕 새 일기 작성 모드');
        setDiaryId(null);
        setDiaryContent('');
        setIsEditing(true);
      }
    } catch (err) {
      console.error('❌ 일기 조회 실패:', err);
    }
  };

  fetchDiary();
}, [selectedDate]);


  // 이 날짜의 이벤트
  
const { eventsByDate, state } = useCalendar();
const [dayEvents, setDayEvents] = useState<EventItem[]>([]);

useEffect(() => {
  setDayEvents(eventsByDate(key));
}, [key, eventsByDate, state.events]); // 👈 state.events를 deps에 추가!

  // 공유하기 핸들러
const handleShare = async () => {
  if (!captureRef.current) return;

  // 영역을 이미지로 렌더
  const dataUrl = await toPng(captureRef.current, {
    cacheBust: true,
    pixelRatio: 2,              // 조금 더 선명하게
    backgroundColor: '#ffffff', // 투명 배경 방지
  });

  // blob으로 변환
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `diary-${key}.png`, { type: 'image/png' });

  // Web Share API (파일 공유) 지원 시
  const navAny = navigator as any;
  if (navAny.canShare && navAny.canShare({ files: [file] })) {
    await navAny.share({
      files: [file],
      title: '오늘의 기록',
      text: '',
    });
  } else {
    // 폴백: 다운로드 트리거
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `diary-${key}.png`;
    a.click();
  }
};
  // 일기 저장/삭제/편집
  // const handleSaveDiary = () => {
  //   setDiary(key, diaryContent);
  //   setIsEditing(false);
  // };
  const handleSaveDiary = async () => {
  try {
    // 수정
const body = {
  content: diaryContent,
  isLiked: false,
  diaryDate: formatDateForServer(selectedDate),
};

    // 새 일기 작성 or 수정
    if (!diaryId) {
  const newDiary = await createDiary(body);
  setDiaryId(newDiary.diaryId);
  setDiary(key, newDiary); // ✅ 날짜(key) 기준으로 로컬 저장
  setDiaryContent(newDiary.content); // ✅ 화면 갱신 추가
  console.log('✅ 일기 작성 완료:', newDiary);
} else {
  const updated = await updateDiary(diaryId, body);
  setDiaryContent(updated.content); // ✅ 수정도 반영
  setDiary(key, updated); // ✅ 수정 시도 저장
  console.log('✅ 일기 수정 완료:', updated);
}
setIsEditing(false);

  } catch (err) {
    console.error('일기 저장 실패:', err);
  }
};

const handleDeleteDiary = async () => {
  if (!diaryId) return;
  try {
    await deleteDiary(diaryId);
    setDiaryId(null);
    setDiaryContent('');
    setIsEditing(true);
  } catch (err) {
    console.error('일기 삭제 실패:', err);
  }
};

 
  const handleStartEdit = () => setIsEditing(true);


const handleCancelEdit = async () => {
  try {
    const formattedDate = formatDateForServer(selectedDate);
    const diary = await getDiaryByDate(formattedDate);

    if (diary) {
      setDiaryContent(diary.content);
    } else {
      setDiaryContent('');
    }
  } catch (err) {
    console.error('일기 취소 중 서버 데이터 복구 실패:', err);
  } finally {
    setIsEditing(false);
  }
};

  // 이벤트 추가 (IME 대응)
  const handleAddEvent = () => {
    const title = newEventTitle.trim();
    if (!title) return;
    addEvent(key, title);
    setNewEventTitle('');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const native: any = e.nativeEvent;
    if (native.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEvent();
    }
  };

  // 이벤트 수정
  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };
  const saveEdit = () => {
    if (!editingId) return;
    updateEvent(editingId, { title: editingTitle.trim() || '(제목 없음)' });
    setEditingId(null);
    setEditingTitle('');
  };

  // 사진 분석 (더미)
  const analysis = getPhoto(key);
// const handleAnalyzeFromDataUrl = async (dataUrl: string) => {
//   try {
//     // 1️⃣ DataURL → Blob 변환
//     const res = await fetch(dataUrl);
//     const blob = await res.blob();
   
//     // 2️⃣ S3 업로드용 Presigned URL 요청
//     const date = formatDateForServer(selectedDate);
//     const { url } = await getPresignedUploadUrl(date, blob.type); // ← 새 API 함수
//     console.log("📸 Presigned URL 발급됨:", url);

//     // 3️⃣ 해당 URL로 PUT 업로드
//     await fetch(url, {
//         method: 'PUT',
//         headers: { 'Content-Type': blob.type },
//         body: blob,
// });
//   console.log("✅ S3 업로드 완료");

// // 4️⃣ Spring Boot AI 분석 요청 (S3 URL + 일기날짜)
//     const result = await analyzeEmotionByUrl(date, url);
//     console.log("✅ 감정 분석 완료:", result);

//     // 5️⃣ 상태 저장 (로컬)
//     setPhoto({
//       date: key,
//       imageDataUrl: dataUrl,
//       summary: result.analysis ??`현재 감정은 ${result.predicted_emotion}입니다.`,
//       stats: result.all_predictions,
//     });

//     console.log('✅ 사진 업로드 + 분석 완료');
//   } catch (error) {
//     console.error('❌ 감정 분석 실패:', error);
//   }
// };
const handleAnalyzeFromDataUrl = async (dataUrl: string) => {
  try {
    // 1️⃣ DataURL → Blob 변환
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    // 2️⃣ 일기 ID 확인 (없으면 먼저 생성)
    let currentDiaryId = diaryId;
    if (!currentDiaryId) {
      const body = {
        content: diaryContent || "(내용 없음)",
        isLiked: false,
        diaryDate: formatDateForServer(selectedDate),
      };
      const newDiary = await createDiary(body);
      setDiaryId(newDiary.diaryId);
      setDiary(key, newDiary);
      currentDiaryId = newDiary.diaryId;
      console.log("🆕 새 일기 생성 완료:", newDiary.diaryId);
    }

    // 3️⃣ S3 업로드용 Presigned URL 요청
    const date = formatDateForServer(selectedDate);
    const { url: uploadUrl } = await getPresignedUploadUrl(date, blob.type);
    console.log("📸 Presigned Upload URL 발급:", uploadUrl);

    // 4️⃣ S3 업로드 실행 (PUT)
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": blob.type },
      body: blob,
    });
    console.log("✅ S3 업로드 완료");

    // 5️⃣ 다운로드용 Presigned URL 요청 (GET)
 if (!diaryId) {
  console.error("❌ diaryId가 없습니다. 일기를 먼저 생성하세요.");
  return;
}

const face = await getDiaryFaceUrl(diaryId);

    const downloadUrl = face?.url;
    if (!downloadUrl) {
      throw new Error("다운로드 URL을 가져오지 못했습니다.");
    }
    console.log("✅ Presigned Download URL:", downloadUrl);

    // 6️⃣ FastAPI로 감정 분석 요청
    const result = await analyzeEmotionByUrl(date, downloadUrl);
    console.log("✅ 감정 분석 완료:", result);

    // 7️⃣ 결과 저장
    setPhoto({
      date: key,
      imageDataUrl: downloadUrl, // ✅ S3 URL 사용
      summary: result.analysis ?? `현재 감정은 ${result.predictedEmotion}입니다.`,
      stats: result.allPredictions,
    });

    console.log("✅ 사진 업로드 + 분석 완료");
  } catch (error) {
    console.error("❌ 감정 분석 실패:", error);
  }
};
const handleDeleteAnalysis = async () => {
  if (!diaryId) return;
  try {
    await deleteAnalysisByDiaryId(diaryId);
    clearPhoto(key); // store에서 삭제
    alert("감정분석이 삭제되었습니다!");
  } catch (err) {
    console.error("❌ 감정분석 삭제 실패:", err);
  }
};


//   useEffect(() => {
//   // 더미 데이터는 한 번만 넣도록 (없을 때만)
//   if (!gifts || gifts.length === 0) {
//     setGifts(key, [
//       {
//         id: 'g1',
//         title: '에어팟 4세대',
//         imageUrl: '/images/airpods.png',
//       },
//       {
//         id: 'g2',
//         title: '비행기',
//         imageUrl: '/images/plane.png',
//       },
//       {
//         id: 'g3',
//         title: '진격의거인 포스터',
//         imageUrl: '/images/freedom.png',
//       },
//     ]);
//   }
// }, [key, gifts, setGifts]);
useEffect(() => {
  const fetchGifts = async () => {
    try {
      const formattedDate = formatDateForServer(selectedDate);
      const data = await getRecommendGifts(formattedDate);

      console.log('🎁 추천 선물 목록:', data);

      if (!data || data.length === 0) {
        console.log('📭 아직 추천받은 선물이 없습니다.');
        // 추천이 없는 날엔 store를 건드리지 않음 → 기존 SmallText 문구 그대로 노출
        return;
      }

      // 응답 데이터를 Gift 구조에 맞게 매핑
      const mapped = data.map((item: any) => ({
        id: item.recommendId,
        title: item.name,
        imageUrl: item.imageUrl,
      }));

      setGifts(key, mapped);
    } catch (err) {
      console.error('❌ 추천 선물 불러오기 실패:', err);
    }
  };

  fetchGifts();
}, [key, selectedDate, setGifts]);

  return (
    <Wrapper>
      <Sidebar>
        <DateHeader>
          <DateTitle>
            {selectedDate.getFullYear()} {selectedDate.toLocaleDateString('ko-KR', { month: 'short' })}
          </DateTitle>
        </DateHeader>
        <Holidays currentDate={selectedDate} />
      </Sidebar>

      <Main>
        <Header>
          <BackButton onClick={onBack}><svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.25 22.5L28.875 31.125L26.25 33.75L15 22.5L26.25 11.25L28.875 13.875L20.25 22.5Z" fill="#1D1B20"/>
</svg>
 </BackButton>
          {/* <HeaderCenter>캘린더</HeaderCenter> */}
          <DateNumber>{selectedDate.getDate()}</DateNumber>
          <HeaderRight>
            <ShareButton onClick={handleShare}><svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33301 9V15C3.33301 15.3978 3.5086 15.7794 3.82116 16.0607C4.13372 16.342 4.55765 16.5 4.99967 16.5H14.9997C15.4417 16.5 15.8656 16.342 16.1782 16.0607C16.4907 15.7794 16.6663 15.3978 16.6663 15V9M13.333 4.5L9.99967 1.5M9.99967 1.5L6.66634 4.5M9.99967 1.5L9.99967 11.25" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
             공유하기</ShareButton>
            <CameraButton onClick={() => setShowCamera(true)}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_676_1504)">
              <path d="M19.1663 15.8333C19.1663 16.2754 18.9907 16.6993 18.6782 17.0118C18.3656 17.3244 17.9417 17.5 17.4997 17.5H2.49967C2.05765 17.5 1.63372 17.3244 1.32116 17.0118C1.0086 16.6993 0.833008 16.2754 0.833008 15.8333V6.66667C0.833008 6.22464 1.0086 5.80072 1.32116 5.48816C1.63372 5.17559 2.05765 5 2.49967 5H5.83301L7.49967 2.5H12.4997L14.1663 5H17.4997C17.9417 5 18.3656 5.17559 18.6782 5.48816C18.9907 5.80072 19.1663 6.22464 19.1663 6.66667V15.8333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.99967 14.1667C11.8406 14.1667 13.333 12.6743 13.333 10.8333C13.333 8.99238 11.8406 7.5 9.99967 7.5C8.15873 7.5 6.66634 8.99238 6.66634 10.8333C6.66634 12.6743 8.15873 14.1667 9.99967 14.1667Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
      <defs>
<clipPath id="clip0_676_1504">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
사진찍기</CameraButton>
          </HeaderRight>
        </Header>

        
      {/* 캡처 대상 시작 */}
      <ShareTarget ref={captureRef}>
        {/* 사진 분석 */}
        <Section>
          <SectionTitle>오늘의 표정 분석</SectionTitle>
          {analysis?.imageDataUrl ? (
            <AnalysisCard>
              <AnalysisThumb src={analysis.imageDataUrl} alt="captured" />
              <div>
                <b>사진 분석 결과:</b>
                <p>{analysis.summary}</p>
               {analysis.stats && (
  <StatsBox>
   {Object.entries(analysis.stats).map(([emotion, value]) => {
  const mapped = EMOTION_MAP[emotion];
  if (!mapped) return null;

  return (
    <EmotionTag key={emotion}>
      <span>{mapped.emoji}</span> {mapped.label} {value}
    </EmotionTag>
  );
})}



  </StatsBox>
)}

                <div style={{ marginTop: 8 }}>
                  {/* <GhostButton onClick={() => clearPhoto(key)}>삭제하기</GhostButton> */}
                  <GhostButton onClick={handleDeleteAnalysis}>삭제하기</GhostButton>

                </div>
              </div>
            </AnalysisCard>
          ) : (
            <EmptyBox>
              아직 사진을 찍지 않았어요. 오른쪽 상단의 <b>사진찍기</b>를 눌러 촬영하세요.
            </EmptyBox>
          )}
        </Section>

        {/* 일기 */}
        <Section>
          <SectionTitle>일기 작성</SectionTitle>
          <DiaryTextarea
            placeholder="오늘의 일기를 작성해보세요..."
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            readOnly={!isEditing}
            $readonly={!isEditing}
          />
          <Row $gap="12" style={{ justifyContent: 'flex-end', width: '100%' }}>
            {isEditing ? (
              <>
                <Primary onClick={handleSaveDiary}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
<g clipPath="url(#clip0_676_1407)">
<path d="M18.3337 1.66699L9.16699 10.8337M18.3337 1.66699L12.5003 18.3337L9.16699 10.8337M18.3337 1.66699L1.66699 7.50033L9.16699 10.8337" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_676_1407">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
저장하기</Primary>
               
              </>
            ) : (
              <>
                <Primary onClick={handleStartEdit}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M13.4883 0.116921C13.9225 0.315323 14.435 0.602608 14.8425 0.99068C15.2508 1.37955 15.5525 1.86682 15.7592 2.28029C16.02 2.79931 15.8508 3.39768 15.425 3.80401L9.41333 9.52828C9.155 9.7743 8.84 9.95762 8.4925 10.064L4.97417 11.1377C4.86474 11.1711 4.74775 11.1752 4.63606 11.1494C4.52437 11.1236 4.4223 11.069 4.34109 10.9916C4.25987 10.9142 4.20264 10.8169 4.17569 10.7105C4.14874 10.6041 4.15311 10.4927 4.18833 10.3885L5.31583 7.03874C5.42713 6.70804 5.61968 6.4074 5.8775 6.16181L11.8892 0.436744C12.3158 0.0304186 12.9442 -0.12989 13.4892 0.117715L13.4883 0.116921ZM13.6642 2.11363C13.4583 1.92844 13.226 1.77188 12.9742 1.64858L7.14583 7.19905C7.0866 7.25536 7.0366 7.31984 6.9975 7.39031L5.75 9.6497L8.12167 8.46247C8.19667 8.42517 8.26417 8.37755 8.32333 8.32121L14.1517 2.77074C14.0222 2.5309 13.8586 2.30969 13.6642 2.11363ZM1.66583 2.82311C1.66565 2.72174 1.70622 2.62415 1.77921 2.55037C1.85219 2.47658 1.95207 2.43219 2.05833 2.42631L6.66667 2.43028C6.88768 2.43028 7.09964 2.34667 7.25592 2.19784C7.4122 2.04901 7.5 1.84715 7.5 1.63667C7.5 1.4262 7.4122 1.22434 7.25592 1.07551C7.09964 0.926682 6.88768 0.84307 6.66667 0.84307L2.08333 0.839102C1.5308 0.839102 1.0009 1.04813 0.610194 1.42021C0.219493 1.79228 0 2.29692 0 2.82311V12.8043C0 13.4074 0.0683333 13.7447 0.265833 14.0955C0.4525 14.428 0.730833 14.6939 1.08 14.8716C1.44833 15.0589 1.80167 15.124 2.43583 15.124H12.5642C13.1975 15.124 13.5517 15.0589 13.92 14.8716C14.27 14.6939 14.5483 14.428 14.735 14.0955C14.9317 13.7447 15 13.4082 15 12.8043V8.77515C15 8.56467 14.9122 8.36281 14.7559 8.21399C14.5996 8.06516 14.3877 7.98154 14.1667 7.98154C13.9457 7.98154 13.7337 8.06516 13.5774 8.21399C13.4211 8.36281 13.3333 8.56467 13.3333 8.77515V12.8043C13.3333 13.1685 13.3158 13.2574 13.265 13.3471C13.2361 13.4006 13.1903 13.4442 13.1342 13.4717C13.04 13.5193 12.9467 13.5368 12.5642 13.5368H2.43583C2.05333 13.5368 1.96083 13.5193 1.86583 13.4717C1.80963 13.4442 1.76388 13.4006 1.735 13.3471C1.685 13.2574 1.66667 13.1685 1.66667 12.8043L1.66583 2.82311Z" fill="white"/>
</svg>
수정하기</Primary>
                <DangerOutline onClick={handleDeleteDiary}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="white"/>
</svg>
삭제하기</DangerOutline>
              </>
            )}
          </Row>
        </Section>
      </ShareTarget>
      {/* 캡처 대상 끝 */}
        {/* 이벤트 */}
        <Section>
          <SectionTitleRow>
            <span>일정 및 이벤트 추가</span>
            <PrimarySmall onClick={handleAddEvent} type="button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.0003 4.16699V15.8337M4.16699 10.0003H15.8337" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
일정 추가
            </PrimarySmall>
          </SectionTitleRow>

          <List>
            {dayEvents.map((ev) => (
              <ListItem key={ev.id}>
                {editingId === ev.id ? (
                  <EditRow>
                    <input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} />
                    <PrimarySmall onClick={saveEdit} type="button">
                      저장
                    </PrimarySmall>
                    <GhostButton onClick={() => setEditingId(null)}>취소</GhostButton>
                  </EditRow>
                ) : (
                  <>
                    <ItemTitle>{ev.title}</ItemTitle>
                    <ItemActions>
                      <IconBtn onClick={() => startEdit(ev.id, ev.title)}><svg width="40" height="39" style={{transform: 'translateY(2px)'}} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="19.5455" cy="19.5" rx="19.5455" ry="19.5" fill="#D2F9D9"/>
<path fillRule="evenodd" clipRule="evenodd" d="M25.3067 11.9079C25.7409 12.1063 26.2534 12.3936 26.6609 12.7817C27.0692 13.1706 27.3709 13.6578 27.5775 14.0713C27.8384 14.5903 27.6692 15.1887 27.2434 15.595L21.2317 21.3193C20.9734 21.5653 20.6584 21.7486 20.3109 21.855L16.7925 22.9287C16.6831 22.9622 16.5661 22.9662 16.4544 22.9404C16.3427 22.9146 16.2407 22.86 16.1594 22.7826C16.0782 22.7052 16.021 22.6079 15.994 22.5015C15.9671 22.3951 15.9715 22.2837 16.0067 22.1796L17.1342 18.8298C17.2455 18.4991 17.438 18.1984 17.6959 17.9528L23.7075 12.2278C24.1342 11.8214 24.7625 11.6611 25.3075 11.9087L25.3067 11.9079ZM25.4825 13.9046C25.2767 13.7195 25.0444 13.5629 24.7925 13.4396L18.9642 18.9901C18.905 19.0464 18.855 19.1109 18.8159 19.1813L17.5684 21.4407L19.94 20.2535C20.015 20.2162 20.0825 20.1686 20.1417 20.1122L25.97 14.5618C25.8405 14.3219 25.677 14.1007 25.4825 13.9046ZM13.4842 14.6141C13.484 14.5128 13.5246 14.4152 13.5976 14.3414C13.6706 14.2676 13.7704 14.2232 13.8767 14.2173L18.485 14.2213C18.706 14.2213 18.918 14.1377 19.0743 13.9889C19.2306 13.84 19.3184 13.6382 19.3184 13.4277C19.3184 13.2172 19.2306 13.0154 19.0743 12.8665C18.918 12.7177 18.706 12.6341 18.485 12.6341L13.9017 12.6301C13.3492 12.6301 12.8193 12.8391 12.4286 13.2112C12.0379 13.5833 11.8184 14.0879 11.8184 14.6141V24.5953C11.8184 25.1984 11.8867 25.5357 12.0842 25.8865C12.2709 26.219 12.5492 26.4849 12.8984 26.6626C13.2667 26.8499 13.62 26.915 14.2542 26.915H24.3825C25.0159 26.915 25.37 26.8499 25.7384 26.6626C26.0884 26.4849 26.3667 26.219 26.5534 25.8865C26.75 25.5357 26.8184 25.1992 26.8184 24.5953V20.5662C26.8184 20.3557 26.7306 20.1538 26.5743 20.005C26.418 19.8562 26.206 19.7726 25.985 19.7726C25.764 19.7726 25.5521 19.8562 25.3958 20.005C25.2395 20.1538 25.1517 20.3557 25.1517 20.5662V24.5953C25.1517 24.9596 25.1342 25.0484 25.0834 25.1381C25.0544 25.1916 25.0087 25.2352 24.9525 25.2627C24.8584 25.3103 24.765 25.3278 24.3825 25.3278H14.2542C13.8717 25.3278 13.7792 25.3103 13.6842 25.2627C13.628 25.2352 13.5822 25.1916 13.5534 25.1381C13.5034 25.0484 13.485 24.9596 13.485 24.5953L13.4842 14.6141Z" fill="#2B8A3E"/>
</svg>
</IconBtn>
                      <IconBtn onClick={() => togglePinned(ev.id)} title="이번 달 이벤트에 고정">
                        {ev.pinned ?  <svg width="40" height="39" style={{transform: 'translateY(2px)'}} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="19.5455" cy="19.5" rx="19.5455" ry="19.5" fill="#FFF3BF"/>
<path d="M20.0003 11.667L22.5753 16.8837L28.3337 17.7253L24.167 21.7837L25.1503 27.517L20.0003 24.8087L14.8503 27.517L15.8337 21.7837L11.667 17.7253L17.4253 16.8837L20.0003 11.667Z" fill="#FF993C" stroke="#FF993C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>:<svg width="40" height="39" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="19.5455" cy="19.5" rx="19.5455" ry="19.5" fill="#FFF3BF"/>
<path d="M20.0003 11.667L22.5753 16.8837L28.3337 17.7253L24.167 21.7837L25.1503 27.517L20.0003 24.8087L14.8503 27.517L15.8337 21.7837L11.667 17.7253L17.4253 16.8837L20.0003 11.667Z" stroke="#FF993C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

}
                      </IconBtn>
                      <IconBtn onClick={() => deleteEvent(ev.id)}><svg width="40" height="39" style={{transform: 'translateY(2px)'}} viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="20.4546" cy="19.5" rx="19.5455" ry="19.5" fill="#FFE3E2"/>
<path d="M15 29C14.45 29 13.9792 28.8042 13.5875 28.4125C13.1958 28.0208 13 27.55 13 27V14H12V12H17V11H23V12H28V14H27V27C27 27.55 26.8042 28.0208 26.4125 28.4125C26.0208 28.8042 25.55 29 25 29H15ZM25 14H15V27H25V14ZM17 25H19V16H17V25ZM21 25H23V16H21V25Z" fill="#E85C5A"/>
</svg>
</IconBtn>
                    </ItemActions>
                  </>
                )}
              </ListItem>
            ))}
          </List>

          <InputRow>
            <EventInput
              placeholder="새로운 일정을 입력하세요..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              
            />
          </InputRow>
        </Section>
        <Section>
           <SectionTitle>선물 추천</SectionTitle>
  {gifts && gifts.length > 0 ? (
    <>
      <SmallText>오늘의 선물 추천 결과입니다.</SmallText>
      <GiftGrid>
        {gifts.map((gift) => (
          <GiftCard key={gift.id}>
            <GiftThumb src={gift.imageUrl} alt={gift.title} />
            <GiftTitle>{gift.title}</GiftTitle>
          </GiftCard>
        ))}
      </GiftGrid>
    </>
  ) : (
    <SmallText>
      아직 오늘의 선물을 추천 받지 않았어요. <b>추천 기능 페이지</b>에서 추천을 받아보세요!
    </SmallText>
  )}
        </Section>

        {/* 카메라 모달 */}
        <CameraModal open={showCamera} onClose={() => setShowCamera(false)} onCapture={handleAnalyzeFromDataUrl} />
      </Main>
    </Wrapper>
  );
};

export default DiaryDetailPage;

/** ------- 간단 카메라 모달 ------- */
const CameraModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}> = ({ open, onClose, onCapture }) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    })();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  const takePhoto = () => {
    const video = videoRef.current!;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
    onClose();
  };

  return (
    <ModalBackdrop>
      <ModalCard>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 8 }} />
        <Row $gap="8" style={{ marginTop: 12 }}>
          <Primary onClick={takePhoto}>촬영</Primary>
          <GhostButton onClick={onClose}>닫기</GhostButton>
        </Row>
      </ModalCard>
    </ModalBackdrop>
  );
};

/** ------- 스타일 ------- */
const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  padding: 32px;
  min-height: 100vh;
  background: #f8f9fa;
`;
const Sidebar = styled.div`
  width: 240px;
`;
const Main = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
  
`;
const BackButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
`;
const HeaderCenter = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #007bff;
`;
// 기존 HeaderRight를 flex로 바꿔 버튼 나란히
const HeaderRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

// 공유 영역 래퍼(배경을 흰색으로 고정해주면 캡처 결과 안정적)
const ShareTarget = styled.div`
  background: #fff;
  border-radius: 16px;
`;


const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 9999px;
  background: #F1F3F5;
  color: black;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
`;

const CameraButton = styled.button`
display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 9999px;
  background: #F1F3F5;
  color: black;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
`;
const DateHeader = styled.div`
  margin-bottom: 8px;
`;
const DateTitle = styled.h2`
  font-size: 24px;
  color: #999;
  margin: 0;
`;
const DateNumber = styled.div`
  font-size: 48px;
  font-weight: 300;
  color: #333;
  margin-left: 24px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;
const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;
const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const AnalysisCard = styled.div`
  display: flex;
  gap: 16px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
`;
const AnalysisThumb = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;
const EmptyBox = styled.div`
  background: #f8f9fa;
  border: 1px dashed #e0e0e0;
  color: #777;
  padding: 16px;
  border-radius: 8px;
`;

const Row = styled.div<{ $gap?: string }>`
  display: flex;
  gap: ${({ $gap }) => $gap ?? '8'}px;
  align-items: center;
`;
const Primary = styled.button`
  display: inline-flex;         
  align-items: center;
   justify-content: center;       /* (옵션) 가로도 중앙 */
  gap: 6px;                      /* 아이콘-텍스트 간격 */
  line-height: 1;                /* baseline 영향 최소화 */
  
  min-height: 36px;

  padding: 6px 12px;
  background: #4A6CF6;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600; 
`;
const PrimarySmall = styled(Primary)`
  padding: 6px 12px;
  font-size: 13px;
`;
const DangerOutline = styled.button`
  
    display: inline-flex;         
  align-items: center;
   justify-content: center;       /* (옵션) 가로도 중앙 */
  gap: 6px;                      /* 아이콘-텍스트 간격 */
  line-height: 1;                /* baseline 영향 최소화 */
  

  padding: 6px 12px;
  background: #E85C5A;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
`;
const GhostButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;                 /* 행 사이 간격 */
  margin-bottom: 16px;
`;
const ListItem = styled.div`
 
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #F8F9FA;       /* 아주 옅은 회색 */
  border: 1px solid #F0F2F5; /* 테두리 살짝 */
  border-radius: 16px;
  padding: 0px 20px;

  /* 살짝 떠보이게 */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
`;
const ItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600; 
  color: #333;
`;
const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;
const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  
`;

const InputRow = styled.div`
  margin-top: 8px;
`;
const EventInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600; 

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

// Camera modal
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalCard = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  width: min(600px, 92vw);
`;

const EditRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  & > input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600; 
  }
`;

// 읽기모드 시 시각적 표시
const DiaryTextarea = styled.textarea<{ $readonly?: boolean }>`
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600; 

  line-height: 1.5;
  resize: vertical;
  margin-bottom: 12px;
  background-color: ${({ $readonly }) => ($readonly ? '#f8f9fa' : '#fff')};
  color: ${({ $readonly }) => ($readonly ? '#666' : '#333')};
  cursor: ${({ $readonly }) => ($readonly ? 'default' : 'text')};

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;
const SmallText = styled.p`
  font-size: 14px;
  color: #777;
  margin-bottom: 16px;
`;

const GiftGrid = styled.div`
  display: flex;
  gap: 16px;
`;

const GiftCard = styled.div`
  flex: 1;
   flex-direction: column;
  text-align: center;
`;

const GiftThumb = styled.img`
  width: 30vh;
  object-fit: cover;
  margin-bottom: 8px;
  
  height: 30vh;
  border-radius: 12px;
  background-color: #f9f9f9;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GiftTitle = styled.div`
  // font-size: 14px;
  // font-weight: 600;
  // color: #333;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #000;
  width: 100%;
  text-align: left;
`;
const StatsBox = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #555;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  & > div {
    background: #f1f3f5;
    padding: 4px 8px;
    border-radius: 8px;
  }
`;
const EmotionTag = styled.div`
  background: #f1f3f5;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 13px;
  color: #333;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;
