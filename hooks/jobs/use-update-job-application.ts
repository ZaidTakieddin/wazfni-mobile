import { updateApplication } from "@/services/applications";
import { ApplicantStatus } from "@/types/applications";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useUpdateJobApplication = (): UseMutationResult<
  any,
  Error,
  { applicationId: string; status: ApplicantStatus }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
  });
};

export default useUpdateJobApplication;
