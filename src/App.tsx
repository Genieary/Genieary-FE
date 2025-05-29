import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import FriendsPage from './pages/FriendsPage';
import FriendProfilePage from './pages/FriendProfilePage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/recommend" element={<div>추천 페이지</div>} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friend-profile/:friendId" element={<FriendProfilePage />} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
