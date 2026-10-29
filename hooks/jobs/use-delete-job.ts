import { deleteJob } from "@/services/jobs";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useDeleteJob = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-company-archived-jobs"] });
    },
  });
};

export default useDeleteJob;
