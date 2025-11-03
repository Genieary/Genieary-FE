import React from "react";
import styled from "styled-components";

interface Props {
  onClick?: () => void;
}

const ButtonFixed = styled.button`
  position: fixed;
  right: 95px;
  bottom: 55px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 5px;
  background: #fdf8ea;
  border: 2.5px solid #ff9900;
  color: #ff9900;
  font-weight: 800;
  font-size: 1.2rem;
  padding: 10px 32px 10px 24px;
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border 0.15s;

  &:hover {
    background: #fff3d1;
    border-color: #ff9900;
  }
`;

const ButtonArrow = styled.span`
  font-size: 1.5rem;
  font-weight: 900;
`;

const RetryButton: React.FC<Props> = ({ onClick }) => (
  <ButtonFixed onClick={onClick}>
    <ButtonArrow>&gt;</ButtonArrow>
    <span style={{ fontWeight: 800, fontSize: "1.12rem" }}>재추천받기</span>
  </ButtonFixed>
);

export default RetryButton;