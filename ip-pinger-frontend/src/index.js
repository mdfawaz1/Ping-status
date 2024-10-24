import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import PingUI from './PingUI';
import ImageDropZone from './components/ImageDropZone';
import Login from './logincomp/Login';  
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainRoutes />
      </Router>
    </AuthProvider>
  );
};

const MainRoutes = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // Get login state and setter from AuthContext

  useEffect(() => {
    // Check token validity on app initialization
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');

    if (!token || !expiresIn || Date.now() > expiresIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/home" element={<PingUI />} />
          <Route path="/image-dropzone" element={<ImageDropZone />} />
          <Route path="*" element={<Navigate to="/home" />} /> {/* Redirect unknown paths to /home */}
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown paths to /login */}
        </>
      )}
    </Routes>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

