export const authConfig = {
  clientId: "oauth2-pkce-client",
  // Use relative URLs for proxy to work correctly
  authorizationEndpoint:
    "/api/auth/realms/fitness-autho2/protocol/openid-connect/auth",
  tokenEndpoint:
    "/api/auth/realms/fitness-autho2/protocol/openid-connect/token",
  redirectUri: "http://localhost:5173/",
  scope: "openid profile offline_access",
  onRefreshTokenExpire: (event) => event.login(),
  // Enable token decoding
  decodeToken: true,
  autoLogin: false,
  // Add logging for debugging
  enableLogging: true,
  // Explicit token expiration parameters
  tokenExpiresIn: 3600,
  refreshTokenExpiresIn: 86400,
  // Add PKCEMethod explicitly
  pkceMethod: "S256",
  // Extra parameters to ensure proper auth flow
  extraParams: {
    prompt: "login",

  },

  registrationEndpoint:
    "/api/auth/realms/fitness-autho2/clients-registrations/openid-connect",
};
