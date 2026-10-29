import { JobSchema } from "@/schemas/jobs.schema";
import { updateJob } from "@/services/jobs";
import { Job } from "@/types/jobs";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

const useUpdateJob = (
  jobId: string
): UseMutationResult<Job, Error, JobSchema> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job: JobSchema) => updateJob(jobId, job),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["my-company-jobs"],
      });
      queryClient.invalidateQueries({ queryKey: ["job", data.id] });
    },
  });
};

export default useUpdateJob;
