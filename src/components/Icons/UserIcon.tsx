import React from 'react';

const UserIcon = ({ size = 28 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 검은색 원 배경 */}
      <circle cx="16" cy="16" r="16" fill="black" />

      {/* 사람 아이콘 - 흰색 stroke */}
      <path
        transform="translate(7 6) scale(0.7)" 
        d="M23.6663 26V23.3333C23.6663 21.9188 23.1044 20.5623 22.1042 19.5621C21.104 18.5619 19.7475 18 18.333 18H7.66634C6.25185 18 4.8953 18.5619 3.8951 19.5621C2.89491 20.5623 2.33301 21.9188 2.33301 23.3333V26M18.333 7.33333C18.333 10.2789 15.9452 12.6667 12.9997 12.6667C10.0542 12.6667 7.66634 10.2789 7.66634 7.33333C7.66634 4.38781 10.0542 2 12.9997 2C15.9452 2 18.333 4.38781 18.333 7.33333Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserIcon;
