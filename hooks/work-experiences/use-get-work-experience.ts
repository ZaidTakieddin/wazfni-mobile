import { getWorkExperienceById } from "@/services/work-experiences";
import { WorkExperience } from "@/types/work-experiences";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetWorkExperience = (id: string): UseQueryResult<WorkExperience> => {
  return useQuery({
    queryKey: ["work-experience", id],
    queryFn: () => getWorkExperienceById(id),
    enabled: !!id,
  });
};

export default useGetWorkExperience;
