import { getMyCompanyRejectedJobs } from "@/services/companies";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetMyCompanyRejectedJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["my-company-rejected-jobs", options || {}],
    queryFn: getMyCompanyRejectedJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export default useGetMyCompanyRejectedJobs;
