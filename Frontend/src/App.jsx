import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DashboardPage from './components/DashboardPage';
import MainPage from './components/MainPage';
import './index.css'
function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user1');
    return storedUser ? storedUser : undefined;
  });

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage  user={user} setUser={setUser}  />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element=  { user !== undefined ? <MainPage user={user} setUser={setUser}  /> : <Navigate to="/login" />}   >
            <Route path="/" element={<DashboardPage />} />
        </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
