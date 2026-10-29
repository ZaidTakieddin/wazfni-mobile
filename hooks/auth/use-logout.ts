import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

const useLogout = () => {
  const { logout: authLogout } = useAuth();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await authLogout();
    },
  });
};

export default useLogout;
