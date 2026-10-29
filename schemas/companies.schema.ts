import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  workField: z.string().min(1, { message: "المجال مطلوب" }),
  description: z.string().min(1, { message: "الوصف مطلوب" }),
  location: z.string().min(1, { message: "الموقع مطلوب" }),
  size: z.string().min(1, { message: "الحجم مطلوب" }),
  website: z.string().min(1, { message: "الرابط مطلوب" }),
  city: z.string().min(1, { message: "المدينة مطلوبة" }),
  commercial_register: z.string().min(1, { message: "الرقم التجاري مطلوب" }),
  tax_number: z.string().min(1, { message: "الرقم الضريبي مطلوب" }),
  logo: z.instanceof(File).nullish(),
});

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = createCompanySchema.partial();

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;
