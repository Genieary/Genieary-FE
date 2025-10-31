import { ApiClient } from './apiClient';
import { UploadResponse } from '../types/s3';
import { ApiResponse } from '../types/api';

const api = ApiClient.getInstance();

//upload url
export const getPresignedUploadUrl = async (contentType: string): Promise<UploadResponse|null> => {
    try {
        const res = await api.request<ApiResponse<UploadResponse>>(
          `users/profile-image?contentType=${encodeURIComponent(contentType)}`,
          { method: 'GET' }
        );
    
        return res.data?.result ?? null;
      } catch (error: any) {
        console.error('❌ Presigned URL 발급 실패:', error.message || error);
        return null;
      }
    };

//다운로드 url
export const getProfileImageUrl = async (): Promise<string | null> => {
    try {
        const res = await api.request<ApiResponse<string>>('users/profile-image-url', {
          method: 'GET',
        });
    
        return res.data?.result ?? null;
      } catch (error: any) {
        console.error('❌ 프로필 이미지 조회 실패:', error.message || error);
        return null;
      }
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