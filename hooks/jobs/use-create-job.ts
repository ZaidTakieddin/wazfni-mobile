import { JobSchema } from "@/schemas/jobs.schema";
import { createJob } from "@/services/jobs";
import { Job } from "@/types/jobs";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useCreateJob = (): UseMutationResult<
  Job,
  Error,
  JobSchema & { company_id?: number; salary_range?: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-company-jobs"] });
    },
  });
};

export default useCreateJob;
