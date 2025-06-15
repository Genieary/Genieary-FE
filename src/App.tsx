import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import FriendsPage from './pages/FriendsPage';
import FriendProfilePage from './pages/FriendProfilePage';

import CalendarPage from './pages/CalendarPage';

import RecommendPage from './pages/RecommandPage';
import RecommandResultTemplate from './pages/RecommandResultTemplate';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        
        <Route path="/calendar" element={<CalendarPage />} />

        <Route path="/recommend" element={<RecommendPage/>} />
        <Route path="/recommend/result/:category" element={<RecommandResultTemplate />} />
        

        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friend-profile/:friendId" element={<FriendProfilePage />} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
