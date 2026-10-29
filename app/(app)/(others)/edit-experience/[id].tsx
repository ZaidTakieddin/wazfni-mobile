import WorkExperienceForm from "@/components/work-experiences/WorkExperienceForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function EditExperience() {
  const { id } = useLocalSearchParams();
  return <WorkExperienceForm id={id as string} />;
}
