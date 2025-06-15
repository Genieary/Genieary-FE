import React, { useState } from 'react';
import styled from 'styled-components';
import Holidays from '../components/Sidebar/Holidays';

interface DiaryDetailPageProps {
  selectedDate: Date;
  onBack: () => void;
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = ({ selectedDate, onBack }) => {
  const [diaryContent, setDiaryContent] = useState('');
  const [weatherData] = useState({
    condition: '오늘도니 화가 날 것 같아요. 그런데 업데이트를 줄인 것도 보아 약간 미소를 지어지는 것 같아요.',
    sunny: 99,
    cloudy: 0.6,
    rainy: 0.4
  });

  const formatDate = (date: Date) => {
    return `${date.getFullYear()} ${date.toLocaleDateString('ko-KR', { month: 'short' })}`;
  };

  const formatDay = (date: Date) => {
    return date.getDate();
  };

  return (
    <Wrapper>
       
      <Sidebar>
      <DateHeader>
          <DateTitle>{formatDate(selectedDate)}</DateTitle>
        </DateHeader>
        <Holidays />
      </Sidebar>

      <Main>
        <Header>
          <BackButton onClick={onBack}>← 추천 기능</BackButton>
          <HeaderCenter>캘린더</HeaderCenter>
          
        </Header>


        <DateNumber>{formatDay(selectedDate)}</DateNumber>
        <ActionButtons>
       
          <SaveButton>📥 공유하기</SaveButton>
          <EditButton>📷 사진찍기</EditButton>
        </ActionButtons>

        <WeatherSection>
          <WeatherTitle>오늘의 표정 분석</WeatherTitle>
          <WeatherCard>
            <WeatherImage src="/api/placeholder/80/80" alt="사진" />
            <WeatherContent>
              <WeatherLabel>사진 분석 결과:</WeatherLabel>
              <WeatherDescription>{weatherData.condition}</WeatherDescription>
              <WeatherStats>
                맑게: 땨는 {weatherData.sunny}%, 흐름 {weatherData.cloudy}%, 기쁨 {weatherData.rainy}%
              </WeatherStats>
            </WeatherContent>
          </WeatherCard>
          <DeleteButton>🗑️ 삭제하기</DeleteButton>
        </WeatherSection>

        <DiarySection>
          <DiaryTitle>일기 작성</DiaryTitle>
          <DiaryTextarea
            placeholder="오늘의 일기를 작성해보세요..."
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
          />
          <DiaryActions>
            <EditDiaryButton>📝 수정하기</EditDiaryButton>
            <SaveDiaryButton>📝 저장하기</SaveDiaryButton>
          </DiaryActions>
        </DiarySection>

        <EventManagement>
          <EventManagementTitle>
            일정 및 이벤트 추가
            <AddEventButton>+ 일정 추가</AddEventButton>
          </EventManagementTitle>
          
          <EventList>
            <EventListItem>
              <EventListName>팀 미팅</EventListName>
              <EventActions>
                <ActionIcon>📝</ActionIcon>
                <ActionIcon>⭐</ActionIcon>
                <ActionIcon>🗑️</ActionIcon>
              </EventActions>
            </EventListItem>
            
            <EventListItem>
              <EventListName>고양이 산책</EventListName>
              <EventActions>
                <ActionIcon>📝</ActionIcon>
                <ActionIcon>⭐</ActionIcon>
                <ActionIcon>🗑️</ActionIcon>
              </EventActions>
            </EventListItem>
            
            <EventListItem>
              <EventListName>고발과 산책</EventListName>
              <EventActions>
                <ActionIcon>📝</ActionIcon>
                <ActionIcon>⭐</ActionIcon>
                <ActionIcon>🗑️</ActionIcon>
              </EventActions>
            </EventListItem>
          </EventList>
          
          <NewEventInput>
            <EventInput placeholder="새로운 일정을 입력하세요..." />
          </NewEventInput>
        </EventManagement>
      </Main>
    </Wrapper>
  );
};

export default DiaryDetailPage;

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  padding: 32px;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 240px;
`;

const EventSection = styled.div`
  background-color: #fff3cd;
  padding: 16px;
  border-radius: 8px;
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const EventItem = styled.div`
  margin-bottom: 8px;
`;

const EventDate = styled.span`
  color: #ff9500;
  font-size: 12px;
  font-weight: 500;
`;

const EventName = styled.div`
  color: #333;
  font-size: 14px;
`;

const Main = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

const HeaderRight = styled.div`
  color: #007bff;
  font-size: 14px;
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
  margin-bottom: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const WeatherSection = styled.div`
  margin-bottom: 32px;
`;

const WeatherTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const WeatherCard = styled.div`
  display: flex;
  gap: 16px;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const WeatherImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const WeatherContent = styled.div`
  flex: 1;
`;

const WeatherLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;

const WeatherDescription = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const WeatherStats = styled.div`
  font-size: 12px;
  color: #666;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 0;
`;

const DiarySection = styled.div`
  margin-bottom: 32px;
`;

const DiaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const DiaryTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const DiaryActions = styled.div`
  display: flex;
  gap: 12px;
`;

const EditDiaryButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const SaveDiaryButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const EventManagement = styled.div``;

const EventManagementTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const AddEventButton = styled.button`
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const EventList = styled.div`
  margin-bottom: 16px;
`;

const EventListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const EventListName = styled.div`
  font-size: 14px;
  color: #333;
`;

const EventActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
`;

const NewEventInput = styled.div`
  margin-top: 16px;
`;

const EventInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;