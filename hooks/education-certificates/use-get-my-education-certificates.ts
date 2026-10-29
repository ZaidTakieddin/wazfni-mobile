import { useInfiniteScrollQuery } from "@/hooks/use-infinite-query";
import { getMyEducationCertificates } from "@/services/education-certificates";
import { EducationCertificate } from "@/types/education-certificates";

const useGetMyEducationCertificates = () => {
  return useInfiniteScrollQuery<EducationCertificate>({
    queryKey: ["my-education-certificates"],
    queryFn: getMyEducationCertificates,
    limit: 10,
  });
};

export default useGetMyEducationCertificates;
