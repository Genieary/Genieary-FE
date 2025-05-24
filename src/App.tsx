import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/recommend" element={<div>추천 페이지</div>} />
        <Route path="/calendar" element={<div>캘린더 페이지</div>} />
        <Route path="/friends" element={<div>친구 페이지</div>} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
