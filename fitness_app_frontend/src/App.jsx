import { Button, Box, Typography } from "@mui/material";
import { useContext, useEffect, useCallback } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import { useState } from "react";

import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

function App() {
  const {
    token,
    tokenData,
    login, // Changed from logIn to login
    logOut,
    error,
    loginInProgress, // This is the correct property name from the library
  } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const ActivityPage = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <ActivityForm
          onActivityAdded={() => {
            window.location.reload();
          }}
        />
        <ActivityList />
      </Box>
    );
  };

  useEffect(() => {
    if (token) {
      console.log("Token received:", token);
      console.log("Token data:", tokenData);

      dispatch(
        setCredentials({
          token,
          user: tokenData || {},
        })
      );
      setAuthReady(true);
      setIsLoggingIn(false);
    }
  }, [token, tokenData, dispatch]);

  // Create a stable function reference with useCallback
  const handleLogin = useCallback(() => {
    console.log("Login button clicked");
    setIsLoggingIn(true);
    // Clear any local storage that might be causing issues
    localStorage.removeItem("pkce_state");
    localStorage.removeItem("pkce_code_verifier");

    // Small delay to ensure state is updated
    setTimeout(() => {
      try {
        login(); // Changed from logIn to login
        console.log("login function called");
      } catch (error) {
        console.error("Error during login:", error);
        setIsLoggingIn(false);
      }
    }, 100);
  }, [login]);

  // Debug information to verify AuthContext
  console.log("AuthContext values:", {
    hasToken: !!token,
    hasLoginFunction: typeof login === "function",
    isAuthReady: authReady,
    isLoggingIn,
    loginInProgress,
  });

  return (
    <BrowserRouter>
      <Box
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Fitness App
        </Typography>

        {token ? (
          <Box>
            <Routes>
              <Route path="/activities" element={<ActivityPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route
                path="/"
                element={
                  token ? (
                    <Navigate to="/activities" replace />
                  ) : (
                    <div>
                      Welcome to the Fitness App Please login to continue
                    </div>
                  )
                }
              />
            </Routes>
          </Box>
        ) : (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={isLoggingIn}
              sx={{ padding: "10px 20px", fontSize: "16px" }}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>

            {isLoggingIn && (
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                Initiating login process...
              </Typography>
            )}

            {error && (
              <Typography color="error" sx={{ marginTop: 2 }}>
                Error: {error.message || "Authentication error"}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </BrowserRouter>
  );
}

export default App;
