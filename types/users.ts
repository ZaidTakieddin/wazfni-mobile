export interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  lastLogin: string;
  name: string;
  googleId: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  educationCertificate: string | null;
  cv: string;
  avatar: string;
  phone: string | null;
  city: string | null;
  address: string | null;
  birthDate: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
  workExperiences: WorkExperience[];
  educationCertificates: EducationCertificate[];
}

export interface WorkExperience {
  id: string;
  userProfileId: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  current: boolean;
}

export interface EducationCertificate {
  id: string;
  userProfileId: string;
  degree: string;
  university: string;
  certificateName: string | null;
}
