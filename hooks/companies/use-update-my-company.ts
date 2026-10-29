import { UpdateCompanySchema } from "@/schemas/companies.schema";
import { updateMyCompany } from "@/services/companies";
import { Company } from "@/types/companies";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

const useUpdateMyCompany = (): UseMutationResult<
  Company,
  Error,
  UpdateCompanySchema | FormData
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      queryClient.invalidateQueries({ queryKey: ["uploads"] });
    },
  });
};

export default useUpdateMyCompany;
