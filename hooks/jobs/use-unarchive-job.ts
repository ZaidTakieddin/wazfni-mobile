import { unarchiveJob } from "@/services/jobs";
import { Job } from "@/types/jobs";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useUnarchiveJob = (): UseMutationResult<Job, Error, { jobId: string }> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => unarchiveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-company-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-company-archived-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export default useUnarchiveJob;
