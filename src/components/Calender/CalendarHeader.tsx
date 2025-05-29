import React from 'react';
import styled from 'styled-components';

interface Props {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<Props> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <Header>
      <Arrow onClick={onPrevMonth}>&lt;</Arrow>
      <Title>{`${year} ${month}`}</Title>
      <Arrow onClick={onNextMonth}>&gt;</Arrow>
    </Header>
  );
};

export default CalendarHeader;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const Arrow = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Title = styled.div`
  min-width: 160px;
  text-align: center;
`;
