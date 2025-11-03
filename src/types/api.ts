// src/types/api.ts
export type PageInfo = {
  page: number;
  size: number;
  hasNext: boolean;
  totalElements: number;
  totalPages: number;
};

export type BackendResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  pageInfo?: PageInfo | null;
  result?: T;
};

export type FriendItem = {
  friendId: number;
  nickname: string;
  profileImage: string | null;
};

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}