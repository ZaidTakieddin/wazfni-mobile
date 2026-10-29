import { getEducationCertificateById } from "@/services/education-certificates";
import { EducationCertificate } from "@/types/education-certificates";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetEducationCertificate = (id: string): UseQueryResult<EducationCertificate> => {
  return useQuery({
    queryKey: ["education-certificate", id],
    queryFn: () => getEducationCertificateById(id),
    enabled: !!id,
  });
};

export default useGetEducationCertificate;
