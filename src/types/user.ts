import { ApiResponse } from "./api";

export interface CreateProfileRequest {
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  gender: "MALE" | "FEMALE" | "OTHER";
  personalities: string[];
}

export interface ProfileData {
    id: number;
    profileImage: string | null;
    nickname: string;
    email: string;
    birthDate: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    personalities: string[];
    basicProfileCompleted: boolean;
    interestProfileCompleted: boolean;
    isProfileCompleted: boolean;
}

export interface CreateInterestsRequest {
    interestIds: number[];
  }

  export interface InterestItem {
    id: number;
    name: string;
  }
  
  export interface InterestData {
    userId: number;
    interests: (InterestItem & { category: string })[];
    interestCount: number;
  }

  export interface UpdateUserRequest {
    nickname: string; 
    personalities: string[] ;
  }

  export type CreateProfileResponse = ApiResponse<ProfileData>;
  export type GetProfileResponse = ApiResponse<ProfileData>;
  export type UpdateProfileResponse = ApiResponse<ProfileData>;
  export type CreateInterestsResponse = ApiResponse<InterestData>;
export type InterestsResponse = ApiResponse<Record<string, InterestItem[]>>;