import { getMyCompanyJobs } from "@/services/companies";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetMyCompanyJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["my-company-jobs", options || {}],
    queryFn: getMyCompanyJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export default useGetMyCompanyJobs;
