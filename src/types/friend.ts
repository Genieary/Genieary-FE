export type Friend = {
  friendId: number;
  nickname: string;
  profileImage?: string | null;
};

export type FriendSearchResult = {
  friendId: number;
  nickname: string;
  profileImage?: string | null;
  email: string;
};

export type PageInfo = {
  page: number;
  size: number;
  hasNext: boolean;
  totalElements: number;
  totalPages: number;
};

export type ServerEnvelope<T> =
  | { isSuccess: true; code: string; message: string; result: T; pageInfo?: PageInfo }
  | { isSuccess: false; code: string; message: string };