import axios from "axios";
import { ApiClient } from './apiClient';
import { UploadResponse } from '../types/s3';
import { ApiResponse } from '../types/api';

const api = ApiClient.getInstance();

//upload url
export const getPresignedUploadUrl = async (contentType: string): Promise<UploadResponse|null> => {
    const res = await api.request<ApiResponse<UploadResponse>>(
        `users/profile-image?contentType=${encodeURIComponent(contentType)}`,
        {
          method: 'GET',
        });
  
    if (res.error) {
      console.error("❌ presigned upload url 발급 실패:", res.error);
      return null;
    }

    return res.data?.result || null;
  };

//다운로드 url
export const getProfileImageUrl = async (): Promise<string | null> => {
    const res = await api.request<ApiResponse<string>>("users/profile-image-url", {
      method: "GET",
    });
  
    if (res.error) {
      console.error("❌ 프로필 이미지 조회 실패:", res.error);
      return null;
    }
  
    return res.data?.result|| null;
  };

  //s3 에 업로드
  export const uploadFileToS3 = async (uploadUrl: string, file: File): Promise<void> => {
    try {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
    } catch (err) {
      console.error("❌ S3 업로드 실패:", err);
      throw err;
    }
  };