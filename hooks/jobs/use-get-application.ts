import { getApplicationById } from "@/services/applications";
import { Application } from "@/types/applications";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetApplication = (
  applicationId: string
): UseQueryResult<Application> => {
  return useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });
};

export default useGetApplication;
