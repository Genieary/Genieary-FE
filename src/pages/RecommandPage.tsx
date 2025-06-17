import React, { useState } from "react";
import styled from "styled-components";
import RecommandHeader from "../components/Recommand/RecommandHeader";
import RecommandMenu, { LeftTabKey, leftTabs } from "../components/Recommand/RecommandMenu";
import RecommandCategoryGrid, { Category } from "../components/Recommand/RecommandCategoryGrid";

const Container = styled.div`
  background: #fff;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  overflow: hidden;
`;

const Main = styled.main`
  max-width: 100vw;
  margin: 0 auto;
  padding: 48px 0 0 0;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 36px;
  margin-top: 18px;
  width: 90vw;

`;

const CategoryPanel = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 38px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
 width: 100%;
  max-width: 600px;
  min-width: 0;
  margin-bottom:20px;
`;

const RecommandPage: React.FC = () => {
  const [tab, setTab] = useState<LeftTabKey>("basic");

  return (
    <Container>
      <Main>
        <RecommandHeader />
        <ContentRow>
          <RecommandMenu tab={tab} setTab={setTab} />
          <CategoryPanel>
            <RecommandCategoryGrid />
          </CategoryPanel>
        </ContentRow>
      </Main>
    </Container>
  );
};

export default RecommandPage;
