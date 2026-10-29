import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Alert, Platform } from "react-native";
import { z } from "zod";

import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/schemas/auth.schemas";
import { login, me } from "@/services/auth";
import { AuthResponse } from "@/types/auth";
import { User } from "@/types/users";

const useLogin = (): UseMutationResult<AuthResponse<User>, Error, z.infer<typeof loginSchema>> => {
  const { login: authLogin } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: async (data) => {
      if (data?.token) {
        await authLogin(data.token, data.user);
        // Prefetch the user data
        await queryClient.prefetchQuery({
          queryKey: ["me"],
          queryFn: me,
        });
      }
    },
    onError: (error: Error) => {
      console.error("Login error:", error);

      if (Platform.OS === "web") {
        alert(error.message || "Failed to login. Please try again.");
      } else {
        Alert.alert("Login Error", error.message || "Failed to login. Please try again.", [
          { text: "OK" },
        ]);
      }
    },
  });
};

export default useLogin;
