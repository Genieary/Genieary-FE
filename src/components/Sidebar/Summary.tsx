import React from 'react';
import styled from 'styled-components';

const Summary: React.FC = () => {
  return (
    <Box>
      <Title>Summary</Title>
      <Content>
        이번달은 여행을 많이 다니신 것 같네요. <br />
        중요한 프로젝트를 위해 약간의 스트레스를 받은 것 같아요. <br />
        다음달은 스트레스 덜고 미리 준비하는 게 어떨까요 😊
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
`;