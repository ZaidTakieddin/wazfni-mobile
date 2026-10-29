import { getJobViews } from "@/services/jobs";
import { JobView } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

export const useGetViewedJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<JobView>({
    queryKey: ["viewed-jobs", options || {}],
    queryFn: getJobViews,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};
