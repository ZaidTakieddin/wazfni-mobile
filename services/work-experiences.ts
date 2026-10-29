import { WorkExperienceSchema } from "@/schemas/work-experiences.schema";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { WorkExperience } from "@/types/work-experiences";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getMyWorkExperiences = async (
  params?: PaginationParams
): Promise<PaginatedResponse<WorkExperience>> => {
  const response = await axiosInstance.get<PaginatedResponse<WorkExperience>>(
    endpoints.workExperiences.list,
    {
      params,
    }
  );
  return response.data;
};

export const getWorkExperienceById = async (id: string): Promise<WorkExperience> => {
  const response = await axiosInstance.get(endpoints.workExperiences.show.replace(":id", id));
  return response.data;
};

export const createWorkExperience = async (
  workExperience: WorkExperienceSchema
): Promise<WorkExperience> => {
  const response = await axiosInstance.post(endpoints.workExperiences.create, workExperience);
  return response.data;
};

export const deleteWorkExperience = async (id: string): Promise<void> => {
  await axiosInstance.delete(endpoints.workExperiences.delete.replace(":id", id));
};

export const updateWorkExperience = async ({
  id,
  workExperience,
}: {
  id: string;
  workExperience: WorkExperienceSchema;
}): Promise<WorkExperience> => {
  const response = await axiosInstance.patch(
    endpoints.workExperiences.update.replace(":id", id),
    workExperience
  );
  return response.data;
};
