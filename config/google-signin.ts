// Google Sign-In Configuration
// Replace these values with your actual Google Cloud Console credentials

export const GOOGLE_SIGNIN_CONFIG = {
  // Get this from Google Cloud Console -> Credentials -> Web Client ID
  webClientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",

  // Get this from Google Cloud Console -> Credentials -> iOS Client ID
  iosClientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",

  // Get this from Google Cloud Console -> Credentials -> Android Client ID
  androidClientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",

  // Additional configuration options
  offlineAccess: true,
  hostedDomain: "", // Set to your domain if you want to restrict to specific domain
  forceCodeForRefreshToken: true,
};

// Development vs Production configuration
export const getGoogleSignInConfig = () => {
  const isDevelopment = __DEV__;

  return {
    webClientId: isDevelopment
      ? GOOGLE_SIGNIN_CONFIG.webClientId
      : GOOGLE_SIGNIN_CONFIG.webClientId, // You can have different configs for dev/prod
    offlineAccess: GOOGLE_SIGNIN_CONFIG.offlineAccess,
    hostedDomain: GOOGLE_SIGNIN_CONFIG.hostedDomain,
    forceCodeForRefreshToken: GOOGLE_SIGNIN_CONFIG.forceCodeForRefreshToken,
  };
};

// Get iOS URL Scheme for app.json
// Format: com.googleusercontent.apps.{IOS_CLIENT_ID}
export const getIOSUrlScheme = () => {
  const iosClientId = GOOGLE_SIGNIN_CONFIG.iosClientId;
  // Extract the client ID part (before .apps.googleusercontent.com)
  const clientIdPart = iosClientId.split(".")[0];
  return `com.googleusercontent.apps.${clientIdPart}`;
};
