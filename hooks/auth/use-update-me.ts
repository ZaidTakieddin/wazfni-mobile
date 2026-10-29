import { ProfileSchema } from "@/schemas/auth.schemas";
import { updateProfile } from "@/services/auth";
import { User } from "@/types/users";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useUpdateMe = (): UseMutationResult<User, Error, ProfileSchema | FormData> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export default useUpdateMe;
