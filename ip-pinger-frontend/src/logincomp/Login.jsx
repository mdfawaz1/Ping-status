import React from "react";
import Background from "./logincomp/Background";
import { Box, Container } from "@mui/material";
import LoginCard from "./logincomp/LoginCard";

function Login(props) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Background
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      <Container>
        <LoginCard setIsLoggedIn={props.setIsLoggedIn} />
      </Container>
    </Box>
  );
}

export default Login;
