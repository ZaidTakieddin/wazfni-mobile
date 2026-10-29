import { getMyCompanyApprovedJobs } from "@/services/companies";
import { Job } from "@/types/jobs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetMyCompanyApprovedJobs = (): UseQueryResult<Job[]> => {
  return useQuery({
    queryKey: ["my-company-approved-jobs"],
    queryFn: getMyCompanyApprovedJobs,
  });
};

export default useGetMyCompanyApprovedJobs;
