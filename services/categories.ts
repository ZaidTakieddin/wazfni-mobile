import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import { Category, Subcategory } from "@/types/categories";
import axiosInstance, { endpoints } from "@/utils/axiosInstance";

export const getCategories = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Category>> => {
  const response = await axiosInstance.get<PaginatedResponse<Category>>(endpoints.categories, {
    params,
  });

  return response.data;
};

export const getCategoriesUnpaginated = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<ApiResponse<Category[]>>(endpoints.categories);
  return response.data.data;
};

export const getSubcategories = async (
  categoryId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Subcategory>> => {
  const response = await axiosInstance.get<PaginatedResponse<Subcategory>>(
    endpoints.subcategories.list.replace(":categoryId", categoryId),
    { params }
  );
  return response.data;
};

export const getSubcategoriesUnpaginated = async (categoryId: string): Promise<Subcategory[]> => {
  const response = await axiosInstance.get<ApiResponse<Subcategory[]>>(
    endpoints.subcategories.list.replace(":categoryId", categoryId)
  );
  return response.data.data;
};

export const recordCategoryClick = async ({ categoryId }: { categoryId: string }) => {
  const response = await axiosInstance.post<unknown>(
    endpoints.categoryClicks.record.replace(":categoryId", categoryId)
  );
  return response.data;
};
