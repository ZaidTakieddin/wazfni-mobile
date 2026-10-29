import { getMyApplications } from "@/services/applications";
import { Application } from "@/types/applications";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetMyApplications = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Application>({
    queryKey: ["my-applications", options || {}],
    queryFn: getMyApplications,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export default useGetMyApplications;
