import { getBookmarkedJobs } from "@/services/bookmarks";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetBookmarkedJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["bookmarked-jobs", options || {}],
    queryFn: getBookmarkedJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export default useGetBookmarkedJobs;
