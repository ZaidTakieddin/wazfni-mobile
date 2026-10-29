import { EducationCertificateSchema } from "@/schemas/education-certificates.schema";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { EducationCertificate } from "@/types/education-certificates";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getMyEducationCertificates = async (
  params?: PaginationParams
): Promise<PaginatedResponse<EducationCertificate>> => {
  const response = await axiosInstance.get<PaginatedResponse<EducationCertificate>>(
    endpoints.educationCertificates.list,
    { params }
  );
  return response.data;
};

export const getEducationCertificateById = async (id: string): Promise<EducationCertificate> => {
  const response = await axiosInstance.get(endpoints.educationCertificates.show.replace(":id", id));
  return response.data;
};

export const createEducationCertificate = async (
  educationCertificate: EducationCertificateSchema
): Promise<EducationCertificate> => {
  const response = await axiosInstance.post(
    endpoints.educationCertificates.create,
    educationCertificate
  );
  return response.data;
};

export const deleteEducationCertificate = async (id: string): Promise<void> => {
  await axiosInstance.delete(endpoints.educationCertificates.delete.replace(":id", id));
};

export const updateEducationCertificate = async ({
  id,
  educationCertificate,
}: {
  id: string;
  educationCertificate: EducationCertificateSchema;
}): Promise<EducationCertificate> => {
  const response = await axiosInstance.patch(
    endpoints.educationCertificates.update.replace(":id", id),
    educationCertificate
  );
  return response.data;
};
