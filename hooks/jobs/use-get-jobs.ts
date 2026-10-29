import { getJobs } from "@/services/jobs";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

export const useGetJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["jobs", options || {}],
    queryFn: getJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};
