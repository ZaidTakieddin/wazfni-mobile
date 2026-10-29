import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import { ApplicantStatus, Application } from "@/types/applications";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getJobApplications = async (
  jobId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Application>> => {
  const response = await axiosInstance.get<PaginatedResponse<Application>>(
    endpoints.applications.companyByJob.replace(":jobId", jobId),
    { params }
  );
  return response.data;
};

export const getJobApplicationsUnpaginated = async (jobId: string): Promise<Application[]> => {
  const response = await axiosInstance.get<ApiResponse<Application[]>>(
    endpoints.applications.companyByJob.replace(":jobId", jobId)
  );
  return response.data.data;
};

export const getApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get(
    endpoints.applications.show.replace(":applicationId", applicationId)
  );
  return response.data;
};

export const updateApplication = async ({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicantStatus;
}) => {
  const response = await axiosInstance.patch(
    endpoints.applications.update.replace(":applicationId", applicationId),
    { status }
  );
  return response.data;
};

export const getMyApplications = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Application>> => {
  const response = await axiosInstance.get<PaginatedResponse<Application>>(
    endpoints.applications.my,
    {
      params,
    }
  );
  return response.data;
};
