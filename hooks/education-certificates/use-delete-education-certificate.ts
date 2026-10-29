import { deleteEducationCertificate } from "@/services/education-certificates";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

const useDeleteEducationCertificate = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEducationCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-education-certificates"],
      });
    },
  });
};

export default useDeleteEducationCertificate;
