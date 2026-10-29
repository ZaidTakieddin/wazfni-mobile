import { getMyCompanyArchivedJobs } from "@/services/companies";
import { Job } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetMyCompanyArchivedJobs = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Job>({
    queryKey: ["my-company-archived-jobs", options || {}],
    queryFn: getMyCompanyArchivedJobs,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export default useGetMyCompanyArchivedJobs;
