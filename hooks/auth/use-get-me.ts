import { me } from "@/services/auth";
import { UserProfile } from "@/types/users";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetMe = (): UseQueryResult<UserProfile, Error> => {
  return useQuery({
    queryKey: ["me"],
    queryFn: me,
  });
};

export default useGetMe;
