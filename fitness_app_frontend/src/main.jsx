import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./authConfig.js";
import { CircularProgress } from "@mui/material";
createRoot(document.getElementById("root")).render(
  <AuthProvider authConfig={authConfig} loadingComponent={<CircularProgress />}>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
);
