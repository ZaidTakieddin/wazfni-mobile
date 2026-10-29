import { Category } from "./categories";
import { Company } from "./companies";

export interface Job {
  id: string;
  companyId: string;
  jobTitle: string;
  workType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "OTHER";
  contractType: "REMOTE" | "ON_SITE" | "HYBRID";
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD";
  experienceYears: number;
  salaryType: "FIXED" | "RANGE" | "NONE";
  minSalary: number;
  maxSalary: number;
  currency: string | null;
  jobFeatures: string[];
  description: string;
  requirements: string;
  questions: string[];
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  subCategories: Category[];
  company: Company;
  isBookmarked: boolean;
  applications: number;
  _count: {
    applications: number;
    viewHistory: number;
  };
}

export interface JobFilters {
  searchTerm?: string; // Search query across job title, description, requirements, and company name
  title?: string; // Filter by job title (partial match)
  city?: string; // Filter by company city (partial match)
  subCategory?: string; // Filter by subcategory name (partial match)
  subCategoryId?: string; // Filter by specific subcategory ID (exact match)
  categoryId?: string; // Filter by category ID (exact match)
  companyName?: string; // Filter by company name (partial match)
  workType?: string[]; // Work type filter (comma-separated for multiple values)
  contractType?: string[]; // Contract type filter
  experienceLevel?: string[]; // Experience level filter
  minSalary?: string; // Minimum salary
  maxSalary?: string; // Maximum salary
}

export interface JobView {
  id: string;
  userId: string;
  jobId: string;
  viewedAt: string;
  viewCount: number;
  lastViewedAt: string;
  job: Job;
}
