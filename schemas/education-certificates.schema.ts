import { z } from "zod";

export const educationCertificateSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University/Institution is required"),
  certificateName: z.string().optional().nullable(),
  startYear: z.string().min(1, "Start year is required"),
  startMonth: z.string().min(1, "Start month is required"),
  endYear: z.string().optional().nullable(),
  endMonth: z.string().optional().nullable(),
});

export type EducationCertificateSchema = z.infer<
  typeof educationCertificateSchema
>;
