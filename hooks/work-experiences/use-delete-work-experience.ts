import { deleteWorkExperience } from "@/services/work-experiences";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

const useDeleteWorkExperience = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-work-experiences"] });
    },
  });
};

export default useDeleteWorkExperience;
