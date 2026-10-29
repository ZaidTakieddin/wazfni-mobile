import { useInfiniteScrollQuery } from "@/hooks/use-infinite-query";
import { getMyWorkExperiences } from "@/services/work-experiences";
import { WorkExperience } from "@/types/work-experiences";

const useGetMyWorkExperiences = () => {
  return useInfiniteScrollQuery<WorkExperience>({
    queryKey: ["my-work-experiences"],
    queryFn: getMyWorkExperiences,
    limit: 10,
  });
};

export default useGetMyWorkExperiences;
