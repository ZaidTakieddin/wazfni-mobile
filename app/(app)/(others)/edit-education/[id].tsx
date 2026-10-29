import EducationCertificateForm from "@/components/education-certificates/EducationCertificateForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function EditEducation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EducationCertificateForm id={id} />;
}
