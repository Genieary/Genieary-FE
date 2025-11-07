export class AuthService {
    // 토큰 저장
    static saveTokens(userId: number, accessToken: string, refreshToken: string) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId.toString());
    }
  
    // 로그인 상태 확인
    static isLoggedIn(): boolean {
      return !!localStorage.getItem('accessToken');
    }
  
    // 사용자 ID 가져오기
    static getUserId(): number | null {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId) : null;
    }
  
    // 액세스 토큰 가져오기
    static getAccessToken(): string | null {
      return localStorage.getItem('accessToken');
    }
  
    // 리프레시 토큰 가져오기
    static getRefreshToken(): string | null {
      return localStorage.getItem('refreshToken');
    }
  
    // 로그아웃
    static logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    }
  }
  