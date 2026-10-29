import { z } from "zod";

export const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  startYear: z.string().min(1, "Start year is required"),
  startMonth: z.string().min(1, "Start month is required"),
  endYear: z.string().optional().nullable(),
  endMonth: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  current: z.boolean(),
});

export type WorkExperienceSchema = z.infer<typeof workExperienceSchema>;
