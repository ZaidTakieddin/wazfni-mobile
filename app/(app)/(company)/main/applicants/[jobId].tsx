import ApplicantCard from "@/components/applicants/ApplicantCard";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetJob from "@/hooks/jobs/use-get-job";
import useGetJobApplications from "@/hooks/jobs/use-get-job-applications";
import { isRTL } from "@/utils/rtl";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Applicants() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const { allData: applications, isLoading } = useGetJobApplications(jobId as string, {
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: job } = useGetJob(jobId as string);

  if (applications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>المتقدمين على وظيفة - {job?.jobTitle}</Text>
          <Link
            href=".."
            style={{
              position: "absolute",
              right: isRTL() ? "auto" : 16,
              left: isRTL() ? 16 : "auto",
              bottom: 16,
            }}
          >
            <SvgIcon name="arrow-right" size={24} color="#062C65" />
          </Link>
        </View>

        <Text style={styles.noApplicantsText}>لا يوجد متقدمين</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المتقدمين على وظيفة - {job?.jobTitle}</Text>
        <Link
          href=".."
          style={{
            position: "absolute",
            right: isRTL() ? "auto" : 16,
            left: isRTL() ? 16 : "auto",
            bottom: 16,
          }}
        >
          <SvgIcon name="arrow-right" size={24} color="#062C65" />
        </Link>
      </View>

      {/* Applicants List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {applications.map((application) => (
          <ApplicantCard key={application.id} application={application} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    paddingBottom: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  content: {
    flex: 1,
    margin: 16,
  },
  noApplicantsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 16,
  },
});
