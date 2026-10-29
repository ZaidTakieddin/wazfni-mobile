import { EducationCertificateSchema } from "@/schemas/education-certificates.schema";
import { createEducationCertificate } from "@/services/education-certificates";
import { EducationCertificate } from "@/types/education-certificates";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useCreateEducationCertificate = (): UseMutationResult<
  EducationCertificate,
  Error,
  EducationCertificateSchema & { startDate?: string; endDate?: string | null }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEducationCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-education-certificates"],
      });
    },
  });
};

export default useCreateEducationCertificate;
