import { User, UserProfile } from "@/types/users";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getUserById = async (id: string) => {
  const response = await axiosInstance.get<User>(
    endpoints.users.get.replace(":id", id)
  );
  return response.data;
};

export const getUserProfileById = async (id: string) => {
  const response = await axiosInstance.get<UserProfile>(
    endpoints.users.getProfile.replace(":id", id)
  );
  return response.data;
};
