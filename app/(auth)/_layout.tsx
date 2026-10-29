import { useAuth } from "@/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export const unstable_settings = {
  initialRouteName: "login",
};

const AuthMainStack = () => {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(app)/(main)/main" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack initialRouteName="login" screenOptions={{}}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="forget-password" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthMainStack;
