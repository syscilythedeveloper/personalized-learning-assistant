"use client";
import { SignIn } from "@clerk/clerk-react";
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

export default function SignInPage() {
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
        <SignIn />
      </Box>
    </Container>
  );
}
