import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../services/authService";


const ProtectedLayer = () => {
  const currentUserId = AuthService.getUserId();

  if (!currentUserId) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayer;
