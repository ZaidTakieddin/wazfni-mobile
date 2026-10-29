import { ForgetPasswordSchema } from "@/schemas/auth.schemas";
import { forgotPassword } from "@/services/auth";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const useForgotPassword = (): UseMutationResult<any, Error, ForgetPasswordSchema> => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export default useForgotPassword;
