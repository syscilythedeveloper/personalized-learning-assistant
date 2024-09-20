"use client";
import { SignUp, useSignUp } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import Navbar from "../../components/Navbar";

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp(); // Get signUp object
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    // Log isLoaded to check if the sign-up process is complete
    console.log("isLoaded state:", isLoaded);

    // Log the signUp object to see if it's being populated
    console.log("signUp object:", signUp);

    // Check if signUp object contains the user data
    if (isLoaded && signUp && signUp.user) {
      const user = signUp.user;
      const userDataObj = {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "N/A",
        firstName: user.firstName || "N/A",
        lastName: user.lastName || "N/A",
      };

      // Save userData to state
      setUserData(userDataObj);

      // Log user data to the console
      console.log("User Data after sign up:", userDataObj);
    }
  }, [isLoaded, signUp]);

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

      {/* Optionally display user data after sign-up */}
      {userData && (
        <Box sx={{ mt: 4 }}>
          <h3>Sign Up Successful!</h3>
          <p>User ID: {userData.userId}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
        </Box>
      )}
    </Container>
  );
}
