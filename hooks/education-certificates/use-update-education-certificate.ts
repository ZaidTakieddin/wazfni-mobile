import { EducationCertificateSchema } from "@/schemas/education-certificates.schema";
import { updateEducationCertificate } from "@/services/education-certificates";
import { EducationCertificate } from "@/types/education-certificates";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

const useUpdateEducationCertificate = (): UseMutationResult<
  EducationCertificate,
  Error,
  {
    id: string;
    educationCertificate: EducationCertificateSchema & {
      startDate?: string;
      endDate?: string | null;
    };
  }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEducationCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-education-certificates"],
      });
    },
  });
};

export default useUpdateEducationCertificate;
