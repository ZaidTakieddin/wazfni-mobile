import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صالح" }),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(8, { message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  code: z
    .string({ required_error: "الكود مطلوب" })
    .min(4, { message: "الكود يجب أن يكون 4 أرقام" }),
});

export const forgetPasswordSchema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صالح" }),
});

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: "الرمز مطلوب" }),
    newPassword: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "الاسم الأول مطلوب"),
    lastName: z.string().min(1, "الاسم الأخير مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    phoneNumber: z.string().min(10, "رقم الهاتف غير صالح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب").optional(),
  lastName: z.string().min(1, "الاسم الأخير مطلوب").optional(),
  jobTitle: z.string().min(1, "المسمى الوظيفي مطلوب").optional(),
  educationCertificate: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  cv: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  day: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  newPassword: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string(),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
