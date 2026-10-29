import { Redirect, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";

const AuthIndex = () => {
  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeenOnboarding = await SecureStore.getItemAsync("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        router.replace("/(auth)/onboarding");
      }
    };
    checkOnboarding();
  }, []);

  return <Redirect href="/(auth)/login" />;
};

export default AuthIndex;
