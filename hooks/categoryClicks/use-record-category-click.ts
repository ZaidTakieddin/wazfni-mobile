import { recordCategoryClick } from "@/services/categories";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useRecordCategoryClick = (): UseMutationResult<unknown, Error, { categoryId: string }> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordCategoryClick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommended-jobs"] });
    },
  });
};

export default useRecordCategoryClick;
