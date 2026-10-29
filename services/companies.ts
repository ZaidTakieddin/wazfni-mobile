import { CreateCompanySchema, UpdateCompanySchema } from "@/schemas/companies.schema";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { Company } from "@/types/companies";
import { Job } from "@/types/jobs";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getMyCompany = async () => {
  const response = await axiosInstance.get<Company>(endpoints.company.show);
  return response.data;
};

export const createMyCompany = async (company: CreateCompanySchema) => {
  const response = await axiosInstance.post<Company>(endpoints.company.create, company);
  return response.data;
};

export const updateMyCompany = async (company: UpdateCompanySchema | FormData) => {
  if (company instanceof FormData) {
    axiosInstance.defaults.headers.common["Content-Type"] = "multipart/form-data";
  }
  const response = await axiosInstance.patch<Company>(endpoints.company.update, company);
  return response.data;
};

export const deleteMyCompany = async () => {
  const response = await axiosInstance.delete<Company>(endpoints.company.delete);
  return response.data;
};

export const getMyCompanyJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(endpoints.jobs.company, {
    params,
  });
  return response.data;
};

export const getMyCompanyArchivedJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(endpoints.jobs.companyArchived, {
    params,
  });
  return response.data;
};

export const getMyCompanyPendingJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(
    `${endpoints.jobs.company}/pending`,
    {
      params,
    }
  );
  return response.data;
};

export const getMyCompanyApprovedJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(
    `${endpoints.jobs.company}/approved`,
    {
      params,
    }
  );
  return response.data;
};

export const getMyCompanyRejectedJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(
    `${endpoints.jobs.company}/rejected`,
    {
      params,
    }
  );
  return response.data;
};
