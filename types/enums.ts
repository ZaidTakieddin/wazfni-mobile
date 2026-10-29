export interface Option {
  label: string;
  value: string;
}

export const experienceLevelOptions: Option[] = [
  { label: "مبتدئ", value: "ENTRY" },
  { label: "متوسط", value: "MID" },
  { label: "متقدم", value: "SENIOR" },
  { label: "متميز", value: "LEAD" },
];

export const contractTypeOptions: Option[] = [
  { label: "عن بعد", value: "REMOTE" },
  { label: "في المكتب", value: "ON_SITE" },
  { label: "مختلط", value: "HYBRID" },
];

export const workTypeOptions: Option[] = [
  { label: "دوام كامل", value: "FULL_TIME" },
  { label: "دوام جزئي", value: "PART_TIME" },
  { label: "دوام مختلط", value: "HYBRID" },
];

export const degrees: Option[] = [
  { label: "شهادة جامعية", value: "BACHELORS" },
  { label: "ماجستير", value: "MASTERS" },
  { label: "دكتوراه", value: "DOCTORATE" },
  { label: "دبلوم", value: "DIPLOMA" },
];

export const years: Option[] = Array.from({ length: 100 }, (_, i) => ({
  label: (2025 - i).toString(),
  value: (2025 - i).toString(),
}));

export const months: Option[] = Array.from({ length: 12 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));

export const days: Option[] = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));

export const genders: Option[] = [
  { label: "ذكر", value: "MALE" },
  { label: "أنثى", value: "FEMALE" },
];

export const cities: Option[] = [
  { label: "دمشق", value: "Damascus" },
  { label: "حلب", value: "Aleppo" },
  { label: "اللاذقية", value: "Lattakia" },
  { label: "طرطوس", value: "Tartus" },
  { label: "درعا", value: "Daraa" },
  { label: "الرقة", value: "Racah" },
  { label: "الحسكة", value: "Haskah" },
  { label: "حمص", value: "Homs" },
  { label: "إدلب", value: "Idlib" },
  { label: "السويداء", value: "Suwayda" },
];

export const salaryTypes: Option[] = [
  { label: "ثابت", value: "FIXED" },
  { label: "مجال", value: "RANGE" },
  { label: "لا يوجد", value: "NONE" },
];

export interface JobBenefit {
  id: string;
  label: string;
  selected: boolean;
}

export const jobBenefits: JobBenefit[] = [
  { id: "healthInsurance", label: "تأمين صحي", selected: false },
  { id: "transportation", label: "بدل مواصلات", selected: false },
  { id: "meals", label: "بدل طعام", selected: false },
  { id: "socialSecurity", label: "تأمينات اجتماعية", selected: false },
  { id: "bonus", label: "حوافز", selected: false },
];
