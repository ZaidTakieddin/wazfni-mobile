import { WorkExperienceSchema } from "@/schemas/work-experiences.schema";
import { updateWorkExperience } from "@/services/work-experiences";
import { WorkExperience } from "@/types/work-experiences";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

const useUpdateWorkExperience = (): UseMutationResult<
  WorkExperience,
  Error,
  {
    id: string;
    workExperience: WorkExperienceSchema & {
      startDate?: string;
      endDate?: string | null;
    };
  }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-work-experiences"],
      });
    },
  });
};

export default useUpdateWorkExperience;
