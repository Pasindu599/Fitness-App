import { Button, Box, Typography, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
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

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Analytics from "./components/Analytics";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {token ? (
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activities/new" element={<ActivityForm onActivityAdded={() => window.location.reload()} />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                maxWidth: 400,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                🏋️ FitTracker
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Your Personal Fitness Companion
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Track your workouts, monitor progress, and achieve your fitness goals with our comprehensive dashboard.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={isLoggingIn}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(255,255,255,0.5)',
                  }
                }}
              >
                {isLoggingIn ? "Connecting..." : "Get Started"}
              </Button>

              {isLoggingIn && (
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Connecting to your account...
                </Typography>
              )}

              {error && (
                <Typography 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  ⚠️ {error.message || "Authentication error"}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
