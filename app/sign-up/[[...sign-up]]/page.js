"use client";
import { SignUp } from "@clerk/clerk-react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Link,
} from "@mui/material";
import Navbar from "../../components/Navbar";

export default function SignUpPage() {
  return (
    <Container>
      <Navbar />

      <Box
        sx={{ mt: 4 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <SignUp />
      </Box>
    </Container>
  );
}
