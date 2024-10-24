// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './index.css';
// import PingUI from './PingUI';
// import ImageDropZone from './components/ImageDropZone';

// const App = () => (
//   <Router>
//     <Routes>
//       <Route path="/" element={<PingUI />} />
//       <Route path="/image-dropzone" element={<ImageDropZone />} />
//     </Routes>
//   </Router>
// );

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React, { useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './index.css';
// import PingUI from './PingUI';
// import ImageDropZone from './components/ImageDropZone';
// import Login from './logincomp/Login';  // Import the Login component
// import { AuthProvider } from './context/AuthContext';
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

//   return (
//     <Router>
//       {isLoggedIn ? (
//         <Routes>
//           <Route path="/" element={<PingUI />} />
//           <Route path="/image-dropzone" element={<ImageDropZone />} />
//         </Routes>
//       ) : (
//         <Login setIsLoggedIn={setIsLoggedIn} />
//       )}
//     </Router>
//   );
// };

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React, { useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import './index.css';
// import PingUI from './PingUI';
// import ImageDropZone from './components/ImageDropZone';
// import Login from './logincomp/Login'; // Import the Login component
// import { AuthProvider } from './context/AuthContext';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" />;
// };

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

//   return (
//     <Router>
//       <AuthProvider>
//         {isLoggedIn ? (
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <PingUI />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/image-dropzone" element={<ProtectedRoute><ImageDropZone /></ProtectedRoute>} />
//             {/* Add more protected routes as needed */}
//           </Routes>
//         ) : (
//           <Login setIsLoggedIn={setIsLoggedIn} />
//         )}
//       </AuthProvider>
//     </Router>
//   );
// };

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import './index.css';
// import PingUI from './PingUI';
// import ImageDropZone from './components/ImageDropZone';
// import Login from './logincomp/Login';  
// import { AuthProvider, useAuth } from './context/AuthContext';

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <MainRoutes />
//       </Router>
//     </AuthProvider>
//   );
// };

// const MainRoutes = () => {
//   const { isLoggedIn } = useAuth(); // Get the login state from AuthContext

//   return (
//     <Routes>
//       {isLoggedIn ? (
//         <>
//           <Route path="/home" element={<PingUI />} />
//           <Route path="/image-dropzone" element={<ImageDropZone />} />
//           <Route path="*" element={<Navigate to="/home" />} /> {/* Redirect unknown paths to /home */}
//         </>
//       ) : (
//         <>
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown paths to /login */}
//         </>
//       )}
//     </Routes>
//   );
// };

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
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

