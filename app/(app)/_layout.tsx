import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "(main)",
};

const AppStack = () => {
  return (
    <>
      <Stack initialRouteName="(main)" screenOptions={{}}>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(search)" options={{ headerShown: false }} />
        <Stack.Screen name="(others)" options={{ headerShown: false }} />
        <Stack.Screen name="(job)" options={{ headerShown: false }} />
        <Stack.Screen name="(company)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AppStack;
