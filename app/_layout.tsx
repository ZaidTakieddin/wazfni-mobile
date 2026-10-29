import ErrorBoundary from "@/components/ErrorBoundary";
import RTLEnforcer from "@/components/RTLHelper";
import { Colors } from "@/constants/Colors";
import { AuthProvider } from "@/contexts/AuthContext";
import { setupRTL } from "@/utils/rtl";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { I18nManager, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Force RTL right away before any rendering starts
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(auth)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  // Set RTL configuration once at app initialization
  useEffect(() => {
    // Using IIFE to handle async function in useEffect
    (async () => {
      try {
        // Apply full RTL setup (with potential reload)
        await setupRTL(true);
      } catch (error) {
        console.log("Failed to setup RTL (non-critical):", error);
        // Ensure RTL is still applied even if the setup process fails
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }
    })();
  }, []);

  const [loaded, error] = useFonts({
    "RZ-Thin": require("../assets/fonts/Almarai-Regular.ttf"),
    "RZ-Reg": require("../assets/fonts/Almarai-Bold.ttf"),
    "RZ-Bold": require("../assets/fonts/Almarai-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      // Initialize global error handlers after fonts are loaded
      // globalErrorHandler.initialize();

      // Hide splash screen after fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: Colors.background.light }} />;
  }

  // Render the forceRTLLayout component to ensure RTL is applied throughout the app
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <RTLEnforcer>
              <AuthProvider>
                <Stack initialRouteName="(auth)">
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                </Stack>
              </AuthProvider>
            </RTLEnforcer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
