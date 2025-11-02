import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuthKakaoCallback from "./pages/OAuthKakaoCallback";
import FriendsPage from './pages/FriendsPage';
import FriendProfilePage from './pages/FriendProfilePage';
import FriendRequestPage from './pages/FriendRequestPage';
import FriendSearchPage from './pages/FriendSearchPage';
import CalendarPage from './pages/CalendarPage';
import RecommendPage from './pages/RecommandPage';
import RecommandResultTemplate from './pages/RecommandResultTemplate';
import ChatPage from './pages/ChatPage';

import MyPage from './pages/MyPage';

import OnboardingProfilePage from "./pages/OnboardingProfilePage";
import OnboardingInterestsPage from "./pages/OnboardingInterestsPage";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/api/auth/kakao/callback" element={<OAuthKakaoCallback />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/recommend" element={<RecommendPage/>} />
        <Route path="/recommend/result/:category" element={<RecommandResultTemplate />} />
        

        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friends/requests" element={<FriendRequestPage />} />
        <Route path="/friend-profile/:friendId" element={<FriendProfilePage />} />
        <Route path="/friend/:friendId" element={<FriendProfilePage />} />
        <Route path="/friends/chat/*" element={<ChatPage />} />
        <Route path="/friends/search" element={<FriendSearchPage />} />
        <Route path="/mypage/*"
          element={isLoggedIn ? <MyPage /> : <MyPage/>}/>
          {/* <Navigate to="/login" /> */}
        <Route path="/onboarding/profile" element={<OnboardingProfilePage />} />
        <Route path="/onboarding/interests" element={<OnboardingInterestsPage />} />
        <Route path="/onboarding" element={<Navigate to="/onboarding/profile" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={1500} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss={false} draggable pauseOnHover theme="light"/>
    </BrowserRouter>
  );
}

export default App;
