import { getUserProfileById } from "@/services/users";
import { UserProfile } from "@/types/users";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetUserProfile = (id: string): UseQueryResult<UserProfile> => {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => getUserProfileById(id),
    enabled: !!id,
  });
};

export default useGetUserProfile;
