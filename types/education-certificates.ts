export interface EducationCertificate {
  id: string;
  userProfileId: string;
  degree: string;
  university: string;
  certificateName: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}
