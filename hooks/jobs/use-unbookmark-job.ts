import { unbookmarkJob } from "@/services/bookmarks";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useUnbookmarkJob = (): UseMutationResult<{ id: string }, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unbookmarkJob,
    onSuccess: (data, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarked-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] }); // Use jobId from variables instead of data.id
      queryClient.invalidateQueries({ queryKey: ["recommended-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["viewed-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["searched-jobs"] });
    },
  });
};

export default useUnbookmarkJob;
