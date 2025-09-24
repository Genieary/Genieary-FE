import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

type FriendItemProps = {
  name: string;
  showAddButton?: boolean;
  showDeleteButton?: boolean;
  showCancelButton?: boolean;
  showRejectButton?: boolean;
  onDelete?: (name: string) => void;
  onAdd?: (name: string) => void;
  onCancel?: (name: string) => void;
  onReject?: (name: string) => void;
};

const FriendItem = ({
  name,
  showAddButton = false,
  showDeleteButton = false,
  showCancelButton = false,
  showRejectButton = false,
  onDelete,
  onAdd,
  onCancel,
  onReject,
}: FriendItemProps) => {
  const navigate = useNavigate();

  const handleGiftClick = () => navigate(`/friend-profile/${name}`);
  const handleDelete = () => onDelete?.(name);

  return (
    <ItemWrapper>
      <ProfileCircle />
      <ContentWrapper>
        <Name>{name}</Name>
      </ContentWrapper>

      <ButtonGroup>
        {showAddButton && (
          <AddFriendButton onClick={() => onAdd?.(name)}>
            친구 추가 <AddFriendIcon />
          </AddFriendButton>
        )}

        {showCancelButton && (
          <DeleteButton onClick={() => onCancel?.(name)}>
            신청 취소 <DeleteIcon />
          </DeleteButton>
        )}

        {showRejectButton && (
          <DeleteButton onClick={() => onReject?.(name)}>
            거절 <DeleteIcon />
          </DeleteButton>
        )}

        {showDeleteButton && (
          <DeleteButton onClick={handleDelete}>
            친구 삭제 <DeleteIcon />
          </DeleteButton>
        )}

        <GiftButton onClick={handleGiftClick}>
          선물 프로필 <GiftIcon />
        </GiftButton>
      </ButtonGroup>
    </ItemWrapper>
  );
};

export default FriendItem;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
`;

const ProfileCircle = styled.div`
  width: 44px;
  height: 44px;
  background-color: #fff3bf;
  border-radius: 50%;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding-left: 16px;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const GiftButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffe3e2;
  border: 1.5px solid #e85c5a;
  color: #e85c5a;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const AddFriendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #d2f9d9;
  border: 1.5px solid #2b8a3e;
  color: #2b8a3e;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f4f4f4;
  border: 1.5px solid #9aa0a6;
  color: #5f6368;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const GiftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.782 10.0003V18.3337H3.53741V10.0003M10.1597 18.3337V5.83366M10.1597 5.83366H6.43467C5.88581 5.83366 5.35943 5.61417 4.97133 5.22346C4.58323 4.83276 4.3652 4.30286 4.3652 3.75033C4.3652 3.19779 4.58323 2.66789 4.97133 2.27719C5.35943 1.88649 5.88581 1.66699 6.43467 1.66699C9.33193 1.66699 10.1597 5.83366 10.1597 5.83366ZM10.1597 5.83366H13.8848C14.4336 5.83366 14.96 5.61417 15.3481 5.22346C15.7362 4.83276 15.9542 4.30286 15.9542 3.75033C15.9542 3.19779 15.7362 2.66789 15.3481 2.27719C14.96 1.88649 14.4336 1.66699 13.8848 1.66699C10.9875 1.66699 10.1597 5.83366 10.1597 5.83366ZM1.88184 5.83366H18.4376V10.0003H1.88184V5.83366Z" stroke="#E85C5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AddFriendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.333 16.5V14.8333C13.333 13.9493 12.9818 13.1014 12.3567 12.4763C11.7316 11.8512 10.8837 11.5 9.99967 11.5H4.16634C3.28229 11.5 2.43444 11.8512 1.80932 12.4763C1.1842 13.1014 0.833008 13.9493 0.833008 14.8333V16.5M16.6663 5.66667V10.6667M19.1663 8.16667H14.1663M10.4163 4.83333C10.4163 6.67428 8.92396 8.16667 7.08301 8.16667C5.24206 8.16667 3.74967 6.67428 3.74967 4.83333C3.74967 2.99238 5.24206 1.5 7.08301 1.5C8.92396 1.5 10.4163 2.99238 10.4163 4.83333Z" stroke="#2B8A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_676_495)">
      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M18 8L23 13M23 8L18 13M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z" stroke="#757575" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_676_495">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);