import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage';
import OAuthKakaoCallback from "./pages/OAuthKakaoCallback";
import FriendsPage from './pages/FriendsPage';
import FriendProfilePage from './pages/FriendProfilePage';
import FriendRequestPage from './pages/FriendRequestPage';
import FriendSearchPage from './pages/FriendSearchPage';
import CalendarPage from './pages/CalendarPage';
import RecommendPage from './pages/RecommandPage';
import RecommandResultTemplate from './pages/RecommandResultTemplate';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/api/auth/kakao/callback" element={<OAuthKakaoCallback />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/recommend" element={<RecommendPage/>} />
        <Route path="/recommend/result/:category" element={<RecommandResultTemplate />} />
        

        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friends/requests" element={<FriendRequestPage />} />
        <Route path="/friend-profile/:friendId" element={<FriendProfilePage />} />
        <Route path="/friends/chat/*" element={<ChatPage />} />
        <Route path="/friends/search" element={<FriendSearchPage />} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
