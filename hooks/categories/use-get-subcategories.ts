import { useInfiniteScrollQuery } from "@/hooks/use-infinite-query";
import { getSubcategories, getSubcategoriesUnpaginated } from "@/services/categories";
import { PaginationParams } from "@/types/api";
import { Subcategory } from "@/types/categories";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetSubcategories = (categoryId: string, params?: PaginationParams) => {
  return useInfiniteScrollQuery<Subcategory>({
    queryKey: ["subcategories", categoryId],
    queryFn: (paginationParams) => getSubcategories(categoryId, { ...params, ...paginationParams }),
    enabled: !!categoryId && categoryId !== "0",
    limit: 10,
  });
};

export const useGetSubcategoriesUnpaginated = (
  categoryId: string
): UseQueryResult<Subcategory[]> => {
  return useQuery({
    queryKey: ["subcategories-unpaginated", categoryId],
    queryFn: () => getSubcategoriesUnpaginated(categoryId),
    enabled: !!categoryId && categoryId !== "0",
  });
};

export default useGetSubcategories;
