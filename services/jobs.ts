import { JobSchema } from "@/schemas/jobs.schema";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { Job, JobFilters, JobView } from "@/types/jobs";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getJobs = async (params?: PaginationParams): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(endpoints.jobs.list, {
    params,
  });
  return response.data;
};

export const getSearchJobs = async (
  filters: Partial<JobFilters & PaginationParams>
): Promise<PaginatedResponse<Job>> => {
  // Map filters to API parameters
  const apiParams: any = { ...filters };

  // Convert arrays to comma-separated strings for API
  if (filters.workType && Array.isArray(filters.workType)) {
    apiParams.workType = filters.workType.join(",");
  }

  if (filters.contractType && Array.isArray(filters.contractType)) {
    apiParams.contractType = filters.contractType.join(",");
  }

  if (filters.experienceLevel && Array.isArray(filters.experienceLevel)) {
    apiParams.experienceLevel = filters.experienceLevel.join(",");
  }

  const response = await axiosInstance.get<PaginatedResponse<Job>>(endpoints.jobs.search, {
    params: apiParams,
  });
  return response.data;
};

export const createJob = async (job: JobSchema) => {
  console.log("Creating job with payload:", JSON.stringify(job, null, 2));
  console.log("API endpoint:", endpoints.jobs.create);

  const response = await axiosInstance.post<Job>(endpoints.jobs.create, job, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateJob = async (jobId: string, job: JobSchema) => {
  console.log("Updating job with payload:", JSON.stringify(job, null, 2));
  console.log("API endpoint:", endpoints.jobs.update.replace(":jobId", jobId));

  const response = await axiosInstance.patch<Job>(
    endpoints.jobs.update.replace(":jobId", jobId),
    job,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getJob = async (jobId: string) => {
  const response = await axiosInstance.get<Job>(endpoints.jobs.show.replace(":jobId", jobId));
  return response.data;
};

export const deleteJob = async (jobId: string) => {
  const response = await axiosInstance.delete(endpoints.jobs.delete.replace(":jobId", jobId), {
    data: {
      jobId,
    },
  });
  return response.data;
};

export const applyForJob = async ({ jobId, data }: { jobId: string; data: FormData }) => {
  axiosInstance.defaults.headers.common["Content-Type"] = "multipart/form-data";
  const response = await axiosInstance.post(
    endpoints.applications.applyByJob.replace(":jobId", jobId),
    data
  );
  return response.data;
};

export const recordJobView = async ({ jobId }: { jobId: string }) => {
  const response = await axiosInstance.post<unknown>(
    endpoints.jobViews.record.replace(":jobId", jobId),
    {
      jobId,
    }
  );
  return response.data;
};

export const getJobViews = async (
  params?: PaginationParams
): Promise<PaginatedResponse<JobView>> => {
  const response = await axiosInstance.get<PaginatedResponse<JobView>>(endpoints.jobViews.views, {
    params,
  });
  return response.data;
};

export const getRecommendedJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(endpoints.jobViews.recommended, {
    params,
  });
  return response.data;
};

export const archiveJob = async (jobId: string) => {
  const response = await axiosInstance.patch(endpoints.jobs.archive.replace(":jobId", jobId), {
    jobId,
  });
  return response.data;
};

export const unarchiveJob = async (jobId: string) => {
  const response = await axiosInstance.patch(endpoints.jobs.unarchive.replace(":jobId", jobId), {
    jobId,
  });
  return response.data;
};
