import { getJobApplications, getJobApplicationsUnpaginated } from "@/services/applications";
import { Application } from "@/types/applications";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetJobApplications = (
  jobId: string,
  options?: { limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
) => {
  return useInfiniteScrollQuery<Application>({
    queryKey: ["job-applications", jobId],
    queryFn: (paginationParams) => getJobApplications(jobId, { ...paginationParams, ...options }),
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export const useGetJobApplicationsUnpaginated = (jobId: string): UseQueryResult<Application[]> => {
  return useQuery({
    queryKey: ["job-applications-unpaginated", jobId],
    queryFn: () => getJobApplicationsUnpaginated(jobId),
  });
};

export default useGetJobApplications;
