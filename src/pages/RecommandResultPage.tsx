import React, { useState } from "react";
import styled from "styled-components";
import RecommandResultHeader from "../components/Recommand/RecommandResultHeader";
import RecommandMenu, { LeftTabKey } from "../components/Recommand/RecommandMenu";
import RecommandResultGrid from "../components/Recommand/RecommandResultGrid";
import RetryButton from "../components/Recommand/RetryButton";

const Container = styled.div`
  background: #fff;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  overflow: hidden;
`;

const Main = styled.main`
  max-width: ;
  margin: 0 auto;
  padding: 48px 0 0 0;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 36px;
  margin-top: 18px;
`;

const RecommandResultPage: React.FC = () => {
  const [tab, setTab] = useState<LeftTabKey>("basic");

  return (
    <Container>
      <Main>
        <RecommandResultHeader />
        <ContentRow>
          <RecommandMenu tab={tab} setTab={setTab} />
          <RecommandResultGrid />
        </ContentRow>
      </Main>
      <RetryButton />
    </Container>
  );
};

export default RecommandResultPage;
