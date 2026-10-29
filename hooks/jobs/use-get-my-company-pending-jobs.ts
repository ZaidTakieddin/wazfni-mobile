import { getMyCompanyPendingJobs } from "@/services/companies";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetMyCompanyPendingJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["my-company-pending-jobs", options || {}],
    queryFn: getMyCompanyPendingJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export default useGetMyCompanyPendingJobs;
