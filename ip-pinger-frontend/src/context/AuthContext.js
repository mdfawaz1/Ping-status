// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const checkTokenValidity = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setIsLoggedIn(false);
//       return false;
//     }

//     try {
//       const response = await fetch('http://localhost:22000/protected', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const isValid = response.ok;
//       setIsLoggedIn(isValid);
      
//       if (!isValid) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('sessionStart');
//       }
      
//       return isValid;
//     } catch (error) {
//       setIsLoggedIn(false);
//       localStorage.removeItem('token');
//       localStorage.removeItem('sessionStart');
//       return false;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkTokenValidity }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check token validity
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('token');
    console.log("adks--?",token);
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }
  
    try {
      const response = await fetch('http://localhost:22000/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
       
      });
      console.log(response)
  
      const isValid = response.ok;
      setIsLoggedIn(isValid);
      
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('sessionStart');
      }
      
      return isValid;
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('sessionStart');
      return false;
    }
  };
  

  // Check token on initial app load
  useEffect(() => {
    checkTokenValidity();
  }, []); // Empty array ensures this runs only once on mount

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
