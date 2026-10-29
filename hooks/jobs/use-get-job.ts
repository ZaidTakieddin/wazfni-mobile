import { getJob } from "@/services/jobs";
import { Job } from "@/types/jobs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetJob = (jobId: string): UseQueryResult<Job> => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });
};

export default useGetJob;
