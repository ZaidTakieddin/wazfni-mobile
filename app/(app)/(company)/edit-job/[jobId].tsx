import JobForm from "@/components/jobs/JobForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditJob = () => {
  const { jobId } = useLocalSearchParams();

  return <JobForm id={jobId as string} />;
};

export default EditJob;
