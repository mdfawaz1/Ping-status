import React, { useState, useEffect } from "react"; 
import { Card, CardContent, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import './login.css';

export default function LoginCard() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      checkSession();
    }
    
    const intervalId = setInterval(checkSession, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:22000/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:22000/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('sessionStart');
    setIsLoggedIn(false);
    navigate("/login");
  };

  function handleUsernameUpdate(event) {
    setUsername(event.target.value);
  }
  
  function handlePasswordUpdate(event) {
    setPassword(event.target.value);
  }

  async function registerUser() {
    try {
      const response = await fetch('http://localhost:22000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("User registered successfully. Please login.");
        setIsRegistering(false);
        setUsername("");
        setPassword("");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Registration error. Please try again.");
    }
  }

  async function loginUser() {
    try {
      const response = await fetch('http://localhost:22000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Store token and expiration time in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('expiresIn', Date.now() + data.expiresIn); // Store expiration in ms
  
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Invalid username or password.");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  }
  
  // Function to check if the token is valid before making protected requests
  async function checkTokenValidity() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
  
    // If no token or expired, navigate to login
    if (!token || !expiresIn || Date.now() > expiresIn) {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      navigate('/login'); // Redirect to login
      return false;
    }
  
    try {
      const response = await fetch('http://localhost:22000/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const isValid = response.ok;
      setIsLoggedIn(isValid);
  
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        navigate('/login'); // Redirect to login if token is invalid
      }
  
      return isValid;
    } catch (error) {
      console.error('Token validation failed:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      navigate('/login'); // Redirect to login on error
      return false;
    }
  }
  
  function toggleRegisterMode() {
    setIsRegistering(!isRegistering);
    setErrorMessage("");
    setUsername("");
    setPassword("");
  }

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "32rem",
        mx: "auto",
        mt: 10,
        p: 3,
      }}
    >
      <Card
        sx={{
          position: "relative",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          zIndex: 1,
          padding: "8rem 2rem 2rem 2rem",
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            placeholder="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={handleUsernameUpdate}
            name="username"
            autoComplete="username"
          />
          <TextField
            fullWidth
            placeholder="Password"
            type="password"
            variant="outlined"
            margin="normal"
            name="password"
            value={password}
            onChange={handlePasswordUpdate}
            autoComplete="current-password"
          />
          {errorMessage && (
            <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
              {errorMessage}
            </p>
          )}
          
          {isRegistering ? (
            <>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                className="register-button"
                onClick={registerUser}
                sx={{ mt: 2 }}
              >
                Register
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={toggleRegisterMode}
                sx={{ mt: 1 }}
              >
                Already have an account? Login
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                className="login-button"
                onClick={loginUser}
                sx={{ mt: 2 }}
              >
                Login
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={toggleRegisterMode}
                sx={{ mt: 1 }}
              >
                Don't have an account? Register
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}