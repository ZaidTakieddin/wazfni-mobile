import {
  ChangePasswordSchema,
  ForgetPasswordSchema,
  LoginSchema,
  ProfileSchema,
  RegisterSchema,
} from "@/schemas/auth.schemas";
import { AuthResponse } from "@/types/auth";
import { User, UserProfile } from "@/types/users";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const login = async (data: LoginSchema) => {
  const response = await axiosInstance.post<AuthResponse<User>>(endpoints.auth.login, data);
  return response.data;
};

export const register = async (data: RegisterSchema) => {
  const response = await axiosInstance.post<User>(endpoints.auth.register, data);
  return response.data;
};

export const me = async () => {
  const response = await axiosInstance.get<UserProfile>(endpoints.users.myProfile);
  return response.data;
};

export const updateProfile = async (data: ProfileSchema | FormData) => {
  if (data instanceof FormData) {
    axiosInstance.defaults.headers.common["Content-Type"] = "multipart/form-data";
  }
  const response = await axiosInstance.patch<User>(endpoints.users.myProfile, data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post(endpoints.auth.logout);
  return response.data.data;
};

export const changePassword = async (data: ChangePasswordSchema) => {
  const response = await axiosInstance.patch(endpoints.auth.changePassword, data);
  return response.data;
};

export const signinWithGoogle = async (data: { idToken: string }) => {
  const response = await axiosInstance.post(endpoints.auth.signinWithGoogle, data);
  return response.data;
};

export const forgotPassword = async (data: ForgetPasswordSchema) => {
  console.log("Sending forgot password request for:", data.email);
  console.log("API endpoint:", endpoints.auth.forgotPassword);

  const response = await axiosInstance.post(endpoints.auth.forgotPassword, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
  console.log("Sending reset password request");
  console.log("API endpoint:", endpoints.auth.resetPassword);

  const response = await axiosInstance.post(endpoints.auth.resetPassword, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
