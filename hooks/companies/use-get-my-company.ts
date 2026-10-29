import { getMyCompany } from "@/services/companies";
import { Company } from "@/types/companies";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetMyCompany = (): UseQueryResult<Company> => {
  return useQuery({
    queryKey: ["my-company"],
    queryFn: getMyCompany,
  });
};

export default useGetMyCompany;
