import { getRecommendedJobs } from "@/services/jobs";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

export const useGetRecommendedJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["recommended-jobs", options || {}],
    queryFn: getRecommendedJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};
