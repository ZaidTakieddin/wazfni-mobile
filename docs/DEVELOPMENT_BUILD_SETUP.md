# Development Build Setup for Google Sign-In

## Why Development Build is Required
The Google Sign-In library (`@react-native-google-signin/google-signin`) requires native code that isn't available in Expo Go. You need to create a development build (custom Expo app) that includes the native modules.

## Prerequisites
1. EAS CLI installed: `npm install -g @expo/eas-cli`
2. EAS account (free tier available)
3. Google Cloud credentials set up (follow GOOGLE_SIGNIN_SETUP.md first)

## Step 1: Login to EAS
```bash
eas login
```

## Step 2: Configure Your Project (Already Done)
✅ Added `expo-dev-client` to dependencies
✅ Updated `eas.json` with `developmentClient: true`
✅ Added `expo-dev-client` plugin to `app.json`

## Step 3: Update Google Sign-In Configuration
Before building, make sure you've replaced the placeholder values:

### In `app/(auth)/login.tsx`:
```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace this
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
});
```

### In `app.json`:
```json
"iosUrlScheme": "com.googleusercontent.apps.YOUR_ACTUAL_IOS_CLIENT_ID" // Replace this
```

## Step 4: Build Development Client

### For Android:
```bash
eas build --profile development --platform android
```

### For iOS (if you have a Mac and want to test on iOS):
```bash
eas build --profile development --platform ios
```

### For iOS Simulator (if you have a Mac):
```bash
eas build --profile development --platform ios --local
```

## Step 5: Install the Development Build
1. After the build completes, you'll get a download link
2. Download and install the APK on your Android device or emulator
3. For iOS, install via TestFlight or direct installation

## Step 6: Run Your App
```bash
bunx expo start --dev-client
```

This will:
- Start the Metro bundler
- Show a QR code
- Open the custom development client (not Expo Go)
- The Google Sign-In should now work!

## Alternative: Local Development Build (Android)
If you want to build locally and have Android SDK set up:

```bash
bunx expo run:android
```

This will:
- Build the development client locally
- Install it on connected device/emulator
- Start the Metro bundler automatically

## Testing Google Sign-In
1. Open your development build
2. Navigate to login screen
3. Tap "تسجيل دخول من خلال غوغل"
4. Should open Google Sign-In flow
5. After successful sign-in, should redirect to your app

## Troubleshooting

### "RNGoogleSignin could not be found"
- Make sure you're using the development build, not Expo Go
- Rebuild the development client if you added Google Sign-In after the initial build

### "Developer Error" on Android
- Check your SHA-1 fingerprint in Google Cloud Console
- Make sure the package name matches `com.zaidtakieddin.wazfni`

### iOS Sign-In Issues
- Verify the iOS URL scheme in app.json matches your iOS Client ID
- Make sure you've added the correct Bundle ID in Google Cloud Console

### Build Fails
- Make sure you've replaced all placeholder values
- Check that all required credentials are set up in Google Cloud Console
- Try clearing cache: `bunx expo r -c`

## Important Notes
- Development builds are cached, so you only need to rebuild when you add new native dependencies
- For Google Sign-In, you'll need to configure different credentials for development vs production
- Test on both Android and iOS if you plan to support both platforms
- The development build will have a different app icon to distinguish it from production builds 