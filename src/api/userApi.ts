import { ApiClient } from "./apiClient";
import {
  CreateProfileRequest,
  CreateProfileResponse,
  CreateInterestsRequest,
  CreateInterestsResponse,
  InterestItem,
  InterestsResponse,
  ProfileData,
  InterestData
} from "../types/user";
import { ApiResponse } from "../types/api";

export class UserApi {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async createProfile(data: CreateProfileRequest): Promise<ProfileData> {
    const res = await this.apiClient.request<CreateProfileResponse>(
      "/users/profile",
      {
        method: "POST",
        data,
      }
    );

    if (res.error) throw new Error(res.error);
    if (!res.data?.isSuccess)
      throw new Error(res.data?.message || "프로필 등록 실패");

    return res.data.result!; // result만 반환
  }

  async createInterests(data: CreateInterestsRequest): Promise<InterestData> {
    const res = await this.apiClient.request<CreateInterestsResponse>(
      "/users/profile/interests",
      {
        method: "POST",
        data,
      }
    );

    if (res.error) throw new Error(res.error);
    if (!res.data?.isSuccess)
      throw new Error(res.data?.message || "관심사 등록 실패");

    return res.data.result!;
  }

  async getInterests(): Promise<Record<string, InterestItem[]>> {
    const res = await this.apiClient.request<InterestsResponse>(
      "/users/interests",
      {
        method: "GET",
      }
    );

    if (res.error) throw new Error(res.error);
    if (!res.data?.isSuccess)
      throw new Error(res.data?.message || "관심사 목록 조회 실패");

    return res.data.result!;
  }

  async getProfileStatus(): Promise<boolean> {
    const res = await this.apiClient.request<ApiResponse<boolean>>(
      "/users/profile/status",
      { method: "GET" }
    );

    if (res.error) throw new Error(res.error);
    return res.data?.result ?? false;
  }
}
