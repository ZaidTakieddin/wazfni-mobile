# Complete Google Sign-In Setup Guide

## Overview
Google Sign-In has been separated into modular components that handle development vs production environments gracefully. The app will work in both Expo Go (with disabled Google Sign-In) and development builds (with full Google Sign-In functionality).

## File Structure
```
├── hooks/auth/
│   ├── use-google-signin.ts        # Main Google Sign-In hook
│   └── use-login-with-google.ts    # Backend integration hook
├── config/
│   └── google-signin.ts            # Configuration file
├── app/(auth)/
│   └── login.tsx                   # Updated login screen
└── app.json                        # Expo configuration
```

## Step 1: Configure Google Cloud Console

### 1.1 Create OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sign-In API
3. Create three OAuth 2.0 Client IDs:

#### Web Client ID (Required)
- Type: Web application
- Authorized JavaScript origins: `http://localhost:19006`
- Copy the Client ID (format: `xxxxx.apps.googleusercontent.com`)

#### Android Client ID
- Type: Android
- Package name: `com.zaidtakieddin.wazfni`
- SHA-1 fingerprint (get with keytool):
  ```bash
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
  ```

#### iOS Client ID
- Type: iOS
- Bundle ID: `com.zaidtakieddin.wazfni`

## Step 2: Update Configuration Files

### 2.1 Update `config/google-signin.ts`
Replace the placeholder values:
```typescript
export const GOOGLE_SIGNIN_CONFIG = {
  webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_ACTUAL_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ACTUAL_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  // ... rest stays the same
};
```

### 2.2 Update `app.json`
Replace the iOS URL scheme:
```json
{
  "plugins": [
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.YOUR_ACTUAL_IOS_CLIENT_ID"
      }
    ]
  ]
}
```

## Step 3: Testing in Different Environments

### 3.1 Testing in Expo Go
```bash
bunx expo start
```
- ✅ App runs normally
- ✅ Google Sign-In button is disabled with message "غير متوفر في Expo Go"
- ✅ Regular email/password login works
- ❌ Google Sign-In functionality is disabled

### 3.2 Testing in Development Build

#### Option A: Local Build (Android)
```bash
bunx expo run:android
```

#### Option B: EAS Cloud Build
```bash
eas login
eas build --profile development --platform android
```

Then run:
```bash
bunx expo start --dev-client
```

- ✅ App runs in custom development client
- ✅ Google Sign-In button is enabled
- ✅ Full Google Sign-In functionality works
- ✅ idToken is sent to your backend

## Step 4: Backend Integration

Your existing backend integration in `hooks/auth/use-login-with-google.ts` remains unchanged:
- ✅ Receives idToken from Google
- ✅ Sends to your backend endpoint
- ✅ Handles authentication response
- ✅ Manages user state

## Features

### Smart Environment Detection
- Automatically detects if running in Expo Go vs Development Build
- Shows appropriate UI and functionality based on environment
- Prevents crashes in Expo Go

### Graceful Degradation
- In Expo Go: Button shows "غير متوفر في Expo Go" and is disabled
- In Dev Build: Full Google Sign-In functionality

### Centralized Configuration
- All Google credentials in one file (`config/google-signin.ts`)
- Easy to switch between development and production configs
- Clear separation of concerns

### Error Handling
- Comprehensive error handling for different scenarios
- Arabic error messages for better UX
- Console warnings for development

## Troubleshooting

### "RNGoogleSignin could not be found"
- ✅ **Fixed**: App now detects environment and disables feature in Expo Go

### Button appears disabled
- Check if you're in Expo Go (expected behavior)
- Use development build for full functionality

### Google Sign-In fails in development build
- Verify credentials in `config/google-signin.ts`
- Check SHA-1 fingerprint matches Google Cloud Console
- Ensure package name matches exactly

### Build fails
- Make sure all placeholder values are replaced
- Check that Google Sign-In API is enabled in Google Cloud Console

## Production Deployment

1. **Replace development credentials** with production ones in `config/google-signin.ts`
2. **Update SHA-1 fingerprint** in Google Cloud Console for your production keystore
3. **Test thoroughly** on production builds before release

## Benefits of This Implementation

✅ **Works in both Expo Go and Development Builds**  
✅ **Separated concerns** - Google Sign-In logic is modular  
✅ **Centralized configuration** - Easy to manage credentials  
✅ **Graceful error handling** - No crashes, clear user feedback  
✅ **Arabic UI** - Proper localization  
✅ **Future-proof** - Easy to extend or modify 