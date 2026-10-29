import { PaginatedResponse, PaginationParams } from "@/types/api";
import { Job } from "@/types/jobs";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const bookmarkJob = async (jobId: string): Promise<{ id: string }> => {
  const response = await axiosInstance.post(endpoints.bookmarks.markJob.replace(":jobId", jobId), {
    jobId,
  });
  return response.data;
};

export const unbookmarkJob = async (jobId: string): Promise<{ id: string }> => {
  const response = await axiosInstance.delete(
    endpoints.bookmarks.unmarkJob.replace(":jobId", jobId),
    {
      data: {
        jobId,
      },
    }
  );
  return response.data;
};

export const getBookmarkedJobs = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Job>> => {
  const response = await axiosInstance.get<PaginatedResponse<Job>>(endpoints.bookmarks.listJobs, {
    params,
  });
  return response.data;
};
