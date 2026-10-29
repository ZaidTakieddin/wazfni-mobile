export interface Company {
  id: string;
  userId: string;
  logo: string | null;
  name: string;
  workField: string;
  description: string;
  location: string;
  size: string;
  website: string;
  city: string;
  commercial_register: string;
  tax_number: string;
  approvalStatus?: CompanyApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export enum CompanySize {
  EMPTY = "",
  "1-10" = "1-10",
  "11-50" = "11-50",
  "51-200" = "51-200",
  "201-500" = "201-500",
  "501-1000" = "501-1000",
}

export enum CompanyApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
