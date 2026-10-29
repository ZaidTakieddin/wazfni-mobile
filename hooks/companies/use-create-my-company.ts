import { CreateCompanySchema } from "@/schemas/companies.schema";
import { createMyCompany } from "@/services/companies";
import { Company } from "@/types/companies";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

const useCreateMyCompany = (): UseMutationResult<
  Company,
  Error,
  CreateCompanySchema
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMyCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export default useCreateMyCompany;
