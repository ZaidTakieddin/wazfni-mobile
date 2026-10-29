import { RegisterSchema } from "@/schemas/auth.schemas";
import { register } from "@/services/auth";
import { User } from "@/types/users";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

const useRegister = (): UseMutationResult<User, Error, RegisterSchema> => {
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      router.replace("/(auth)/login");
    },
    onError: (error: Error) => {
      console.error("Register error:", error);
      Alert.alert(
        "Register Error",
        error.message || "Failed to register. Please try again.",
        [{ text: "OK" }]
      );
    },
  });
};

export default useRegister;
