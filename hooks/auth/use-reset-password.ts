import { resetPassword } from "@/services/auth";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const useResetPassword = (): UseMutationResult<
  any,
  Error,
  { token: string; newPassword: string }
> => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export default useResetPassword;
