import { applyForJob } from "@/services/jobs";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useApplyForJob = (): UseMutationResult<any, Error, { jobId: string; data: FormData }> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyForJob,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
    },
  });
};

export default useApplyForJob;
