import { useAuth } from "@/contexts/AuthContext";
import { me, signinWithGoogle } from "@/services/auth";
import { AuthResponse } from "@/types/auth";
import { User } from "@/types/users";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useLoginWithGoogle = (): UseMutationResult<
  AuthResponse<User>,
  Error,
  { idToken: string }
> => {
  const { login: authLogin } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["loginWithGoogle"],
    mutationFn: signinWithGoogle,
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
    },
  });
};

export default useLoginWithGoogle;
