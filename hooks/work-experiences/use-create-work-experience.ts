import { WorkExperienceSchema } from "@/schemas/work-experiences.schema";
import { createWorkExperience } from "@/services/work-experiences";
import { WorkExperience } from "@/types/work-experiences";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useCreateWorkExperience = (): UseMutationResult<
  WorkExperience,
  Error,
  WorkExperienceSchema & { startDate?: string; endDate?: string | null }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-work-experiences"] });
    },
  });
};

export default useCreateWorkExperience;
