import { ChangePasswordSchema } from "@/schemas/auth.schemas";
import { changePassword } from "@/services/auth";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { router } from "expo-router";

const useChangePassword = (): UseMutationResult<void, Error, ChangePasswordSchema> => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      router.back();
    },
  });
};

export default useChangePassword;
