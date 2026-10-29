import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const JobLayout = () => {
  return (
    <>
      <StatusBar style="light" backgroundColor="#062C65" />
      <Stack screenOptions={{}}>
        <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default JobLayout;
