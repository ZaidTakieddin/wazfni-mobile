import { Job } from "./jobs";
import { UserProfile } from "./users";

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  answers: string[];
  cvPath: string;
  status: ApplicantStatus;
  appliedAt: string;
  updatedAt: string;
  applicant: {
    id: string;
    email: string;
    name: string;
    profile: UserProfile;
  };
  job: Job;
}

export enum ApplicantStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
