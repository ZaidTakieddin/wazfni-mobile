import { DocumentPickerAsset } from "expo-document-picker";
import { z } from "zod";

export const jobSchema = z.object({
  jobTitle: z.string().min(1, "العنوان الوظيفي مطلوب"),
  subCategoryIds: z.string().cuid("التصنيف الفرعي مطلوب"),
  workType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "OTHER"]),
  contractType: z.enum(["REMOTE", "HYBRID", "ON_SITE"]),
  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD"]),
  experienceYears: z.union([z.string().min(1, "سنوات الخبرة مطلوبة"), z.number()]).refine((val) => {
    if (typeof val === "string") {
      return !isNaN(Number(val));
    }
    return true;
  }, "سنوات الخبرة يجب أن تكون رقم"),
  salaryType: z.enum(["FIXED", "RANGE", "NONE"]),
  minSalary: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === "string") {
      return !isNaN(Number(val));
    }
    return true;
  }, "الحد الأدنى للراتب يجب أن يكون رقم"),
  maxSalary: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === "string") {
      return !isNaN(Number(val));
    }
    return true;
  }, "الحد الأقصى للراتب يجب أن يكون رقم"),
  // currency: z.nativeEnum(Currency).optional(),
  jobFeatures: z.array(z.string()).optional(),
  description: z.string().min(1, "الوصف مطلوب"),
  requirements: z.string().min(1, "المتطلبات مطلوبة"),
  questions: z.array(z.string()).max(3, "يجب أن يكون لديك على الأكثر 3 أسئلة"),
});

export type JobSchema = z.infer<typeof jobSchema>;

export const applicationSchema = z.object({
  cv: z.custom<DocumentPickerAsset>().refine((data) => data.uri !== "", {
    message: "الرجاء اختيار ملف السيرة الذاتية",
  }),
  answers: z
    .array(z.string().min(1, { message: "الرجاء إدخال إجابة" }))
    .refine((data) => data.every((answer) => answer.trim().length > 0), {
      message: "الرجاء الإجابة على جميع الأسئلة",
    }),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
