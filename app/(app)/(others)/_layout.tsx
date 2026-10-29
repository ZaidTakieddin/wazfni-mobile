import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const OthersLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="categories"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="education"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-education"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="personal-info"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="terms-conditions"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="work-experience"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-experience"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-company"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="applicant/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-experience/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-education/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="subcategories/[categoryId]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default OthersLayout;
