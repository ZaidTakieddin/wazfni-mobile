import { recordJobView } from "@/services/jobs";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useRecordJobView = (): UseMutationResult<unknown, Error, { jobId: string }> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordJobView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommended-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["viewed-jobs"] });
    },
  });
};

export default useRecordJobView;
