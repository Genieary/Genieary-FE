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
      <Arrow onClick={onPrevMonth}><svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="21.5" cy="21.5" r="20.5" fill="white" stroke="#F4F6F7" strokeWidth="2"/>
<path d="M20.8 22L25.4 26.6L24 28L18 22L24 16L25.4 17.4L20.8 22Z" fill="#1D1B20"/>
</svg>
</Arrow>
      <Title>{`${year} ${month}`}</Title>
      <Arrow onClick={onNextMonth}><svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="21.5" cy="21.5" r="20.5" transform="rotate(180 21.5 21.5)" fill="white" stroke="#F4F6F7" strokeWidth="2"/>
<path d="M22.2 21L17.6 16.4L19 15L25 21L19 27L17.6 25.6L22.2 21Z" fill="#1D1B20"/>
  </svg>
</Arrow>
      
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
