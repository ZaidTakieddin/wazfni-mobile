import { Urls } from "@/constants/Urls";
import type { AxiosError } from "axios";
import axios from "axios";
import { Platform } from "react-native";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: Urls.BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (__DEV__) {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    if (!error.response) {
      const customError = new Error(
        Platform.OS === "web"
          ? "Network error: Please check your internet connection"
          : "Network error: Please check if you are connected to the internet and the server is accessible"
      );
      return Promise.reject(customError);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: "auth/login",
    register: "auth/register",
    logout: "auth/logout",
    changePassword: "auth/change-password",
    signinWithGoogle: "auth/google",
    forgotPassword: "auth/forgot-password",
    resetPassword: "auth/reset-password",
  },
  categories: "categories",
  subcategories: {
    list: "categories/:categoryId/subcategories",
    show: "categories/subcategories/:subcategoryId",
  },
  categoryClicks: {
    record: "category-clicks/:categoryId",
    list: "category-clicks/my-clicks",
  },
  applications: {
    companyByJob: "applications/company/job/:jobId",
    applyByJob: "applications/job/:jobId",
    user: "applications/user/applications",
    show: "applications/:applicationId",
    update: "applications/:applicationId/status",
    my: "applications/user/applications",
  },
  company: {
    show: "company",
    create: "company",
    update: "company",
    delete: "company",
  },
  jobs: {
    list: "jobs",
    create: "jobs/company",
    update: "jobs/:jobId",
    show: "jobs/:jobId",
    delete: "jobs/:jobId",
    search: "jobs/search",
    company: "jobs/company",
    companyArchived: "jobs/company/archived",
    archive: "jobs/:jobId/archive",
    unarchive: "jobs/:jobId/unarchive",
  },
  jobViews: {
    record: "job-views/:jobId",
    views: "job-views/my-views",
    recommended: "job-views/recommended",
  },
  users: {
    get: "users/:id",
    myProfile: "users/profile/me",
    getProfile: "users/:id/profile",
  },
  workExperiences: {
    list: "profile/work-experience",
    create: "profile/work-experience",
    delete: "profile/work-experience/:id",
    update: "profile/work-experience/:id",
    show: "profile/work-experience/:id",
  },
  educationCertificates: {
    list: "profile/education-certificates",
    create: "profile/education-certificates",
    delete: "profile/education-certificates/:id",
    update: "profile/education-certificates/:id",
    show: "profile/education-certificates/:id",
  },
  bookmarks: {
    listJobs: "bookmarks/jobs",
    markJob: "bookmarks/jobs/:jobId",
    unmarkJob: "bookmarks/jobs/:jobId",
  },
};
