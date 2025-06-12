import React from "react";
import styled from "styled-components";
import JiniImg from "../../assets/jini.png";
import LampImg from "../../assets/lamp.svg";

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  margin-left: 95px;
`;

const LampBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 120px;
  margin-bottom: -70px;
`;

const Lamp = styled.img`
  width: 200px;
  height: 200px;
  margin-top: -95px;
  margin-left: -40px;
`;

const Jini = styled.img`
  width: 55px;
  height: 75px;
  margin-left: 155px;
  margin-top: -20px;
  z-index: 2;
  position: relative;
`;

const QuestionBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -270px;
  width: 100%;
`;

const QuestionText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5;
  color: #222;
  margin-top: 12px;
  text-align: center;

  span {
    color: #4A6CF6;
    font-weight: 800;
  }
`;

const RecommandResultHeader: React.FC = () => (
  <TopRow>
    <LampBox>
      <Jini src={JiniImg} alt="지니" />
      <Lamp src={LampImg} alt="램프" />
    </LampBox>
    <QuestionBox>
      <QuestionText>
        김은삼님을 위한 <span>선물</span> 추천 결과입니다!
      </QuestionText>
    </QuestionBox>
  </TopRow>
);

export default RecommandResultHeader;
