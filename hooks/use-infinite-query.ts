import { PaginatedResponse, PaginationParams } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";

type InfiniteQueryOptions<T> = {
  queryKey: (string | object)[];
  queryFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
  enabled?: boolean;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useInfiniteScrollQuery = <T>({
  queryKey,
  queryFn,
  enabled = true,
  limit = 10,
  sortBy,
  sortOrder = "desc",
}: InfiniteQueryOptions<T>) => {
  const query = useInfiniteQuery<PaginatedResponse<T>, Error>({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      queryFn({
        page: pageParam as number,
        limit,
        sortBy,
        sortOrder,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    enabled,
    initialPageParam: 1,
  });

  // Flatten all pages into a single array with improved safety checks
  const allData =
    query.data?.pages?.reduce<T[]>((acc, page) => {
      // Handle both direct arrays and paginated response objects
      if (Array.isArray(page)) {
        // If page is directly an array, use it
        return [...acc, ...page];
      } else if (page && typeof page === "object" && "data" in page && Array.isArray(page.data)) {
        // If page is a paginated response object with data array
        return [...acc, ...page.data];
      }
      // Fallback for unexpected structures
      console.warn("Unexpected page structure:", page);
      return acc;
    }, []) ?? [];

  const loadNextPage = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  return {
    ...query,
    allData,
    hasNextPage: query.hasNextPage ?? false,
    isLoadingNextPage: query.isFetchingNextPage,
    loadNextPage,
  };
};
