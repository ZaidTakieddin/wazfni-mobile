import { getCategories, getCategoriesUnpaginated } from "@/services/categories";
import { Category } from "@/types/categories";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useInfiniteScrollQuery } from "../use-infinite-query";

const useGetCategories = (options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteScrollQuery<Category>({
    queryKey: ["categories", options || {}],
    queryFn: getCategories,
    limit: options?.limit,
    sortBy: options?.sortBy,
    sortOrder: options?.sortOrder,
  });
};

export const useGetCategoriesUnpaginated = (): UseQueryResult<Category[]> => {
  return useQuery({
    queryKey: ["categories-unpaginated"],
    queryFn: getCategoriesUnpaginated,
  });
};

export default useGetCategories;
