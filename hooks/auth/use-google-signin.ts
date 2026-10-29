import { getGoogleSignInConfig } from "@/config/google-signin";
import Constants from "expo-constants";
import { Alert } from "react-native";
import useLoginWithGoogle from "./use-login-with-google";

export const useGoogleSignIn = () => {
  const { mutate: loginWithGoogle, isPending: isGoogleLoginPending } = useLoginWithGoogle();

  // Check if we're running in a development build (has native modules)
  const isDevBuild = Constants.appOwnership !== "expo";

  const configureGoogleSignIn = async () => {
    // Early return if not in dev build - prevents any imports
    if (!isDevBuild) {
      console.warn("Google Sign-In is only available in development builds");
      return;
    }

    try {
      const config = getGoogleSignInConfig();
      // Only import when we know we're in a dev build
      const { GoogleSignin } = await import("@react-native-google-signin/google-signin");
      GoogleSignin.configure(config);
    } catch (error) {
      console.error("Failed to configure Google Sign-In:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    // Early return if not in dev build - prevents any imports
    if (!isDevBuild) {
      Alert.alert(
        "غير متوفر",
        "تسجيل الدخول بـ Google متاح فقط في إصدار التطوير. يرجى استخدام تطبيق التطوير المخصص.",
        [{ text: "حسناً" }]
      );
      return;
    }

    try {
      // Only import when we know we're in a dev build
      const { GoogleSignin, statusCodes } = await import(
        "@react-native-google-signin/google-signin"
      );

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo?.data?.idToken) {
        loginWithGoogle({ idToken: userInfo.data.idToken });
      } else {
        Alert.alert("خطأ", "فشل في الحصول على معرف الدخول من Google");
      }
    } catch (error: any) {
      // Handle Google Sign-In specific errors
      try {
        const { statusCodes } = await import("@react-native-google-signin/google-signin");

        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("User cancelled Google Sign-In");
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log("Google Sign-In in progress");
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert("خطأ", "خدمات Google Play غير متوفرة");
        } else {
          console.error("Google Sign-In error:", error);
          Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الدخول بـ Google");
        }
      } catch (importError) {
        // If we can't import status codes, just show generic error
        console.error("Google Sign-In error:", error);
        Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الدخول بـ Google");
      }
    }
  };

  return {
    handleGoogleSignIn,
    configureGoogleSignIn,
    isGoogleLoginPending,
    isDevBuild,
  };
};
