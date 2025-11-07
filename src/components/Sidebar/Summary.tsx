import React from 'react';
import styled from 'styled-components';

interface SummaryProps {
  summaryText?: string;   // 한 달 요약 내용 (API에서 받아옴)
  loading?: boolean;      // 로딩 상태 (선택)
}

const Summary: React.FC<SummaryProps> = ({ summaryText, loading }) => {
  if (loading) {
    return (
      <Box>
        <Title>Summary</Title>
        <Content>요약 불러오는 중...</Content>
      </Box>
    );
  }

  return (
    <Box>
      <Title>Summary</Title>
      <Content>
        {summaryText
          ? summaryText
          : '요약이 아직 생성되지 않았어요 😌'}
      </Content>
    </Box>
  );
};

export default Summary;

const Box = styled.div`
  background-color: #FEF9E7;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Content = styled.div`
  line-height: 1.5;
  white-space: pre-wrap; /* 줄바꿈 유지 */
`;
