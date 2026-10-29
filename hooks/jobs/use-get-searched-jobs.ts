import { getSearchJobs } from "@/services/jobs";
import { Job, JobFilters } from "@/types/jobs";
import { useInfiniteScrollQuery } from "../use-infinite-query";

export const useGetSearchedJobs = (
  filters: Partial<JobFilters>,
  options?: { limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
) => {
  // Check if there's a search term or any filters applied
  const hasFilters = !!(
    filters.searchTerm ||
    filters.city ||
    filters.companyName ||
    filters.categoryId ||
    filters.subCategoryId ||
    (filters.workType && filters.workType.length > 0) ||
    (filters.contractType && filters.contractType.length > 0) ||
    (filters.experienceLevel && filters.experienceLevel.length > 0) ||
    filters.minSalary ||
    filters.maxSalary
  );

  return useInfiniteScrollQuery<Job>({
    queryKey: ["searched-jobs", filters, options || {}],
    queryFn: (params) => getSearchJobs({ ...filters, ...params }),
    enabled: hasFilters, // Enable if there are filters or always enable for initial load
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};
