import JobApplicationModal, { JobApplicationModalRef } from "@/components/jobs/JobApplicationModal";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useBookmarkJob from "@/hooks/jobs/use-bookmark-job";
import useGetJob from "@/hooks/jobs/use-get-job";
import useGetMyApplications from "@/hooks/jobs/use-get-my-applications";
import useUnbookmarkJob from "@/hooks/jobs/use-unbookmark-job";
import useGetUploads from "@/hooks/use-get-uploads";
import { experienceLevelOptions, workTypeOptions } from "@/types/enums";
import { isRTL } from "@/utils/rtl";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import {
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const JobDetailsParams = ({
  title,
  icon,
  value,
}: {
  title: string;
  icon: string;
  value: string | number;
}) => {
  return (
    <View style={{ flexDirection: isRTL() ? "row" : "row-reverse", alignItems: "center", gap: 10 }}>
      <View>
        <SvgIcon name={icon} size={16} color={Colors.primary} />
      </View>
      <View style={{ height: 20, width: 1, backgroundColor: Colors.primary }}></View>
      <View
        style={{
          alignItems: "flex-start",
        }}
      >
        <Text style={{ fontSize: 10, fontFamily: "RZ-Bold", color: Colors.grey }}>{title}</Text>
        <Text style={{ fontSize: 10, fontFamily: "RZ-Reg", color: Colors.black }}>{value}</Text>
      </View>
    </View>
  );
};

const JobDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { data: job } = useGetJob(id as string);
  const applicationModalRef = useRef<JobApplicationModalRef>(null);
  const [activeTab, setActiveTab] = useState<"details" | "company">("details");
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const { allData: myApplications } = useGetMyApplications();
  const { mutate: bookmarkJob, isPending: isBookmarking } = useBookmarkJob();
  const { mutate: unbookmarkJob, isPending: isUnbookmarking } = useUnbookmarkJob();

  const toggleSave = () => {
    if (job?.isBookmarked) {
      unbookmarkJob(id as string);
    } else {
      bookmarkJob(id as string);
    }
  };

  const handleOpenModal = useCallback(() => {
    if (applicationModalRef.current) {
      applicationModalRef.current.open();
    }
  }, []);

  const renderJobDetails = () => (
    <View style={{ flex: 1 }}>
      {/* Requirements Card */}
      <View style={styles.tabCard}>
        <TouchableOpacity
          style={{
            position: "absolute",
            zIndex: 10,
            left: isRTL() ? "auto" : 15,
            right: isRTL() ? 15 : "auto",
            top: 15,
          }}
          onPress={() => setIsDetailsExpanded(!isDetailsExpanded)}
        >
          <SvgIcon
            name="arrow-down-circle"
            size={20}
            color={Colors.primary}
            style={{ transform: [{ rotate: isDetailsExpanded ? "180deg" : "0deg" }] }}
          />
        </TouchableOpacity>
        <View style={styles.requirementsParent}>
          <Text style={styles.sectionTitle}>التفاصيل</Text>
          {isDetailsExpanded && (
            <>
              <View
                style={{
                  flexDirection: isRTL() ? "row" : "row-reverse",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <JobDetailsParams
                  title={"الراتب"}
                  value={
                    job?.salaryType === "FIXED"
                      ? job?.minSalary
                      : job?.salaryType === "RANGE"
                        ? `${job?.minSalary} - ${job?.maxSalary}`
                        : "لا يوجد"
                  }
                  icon={"dollar-sign-circle"}
                />
                <JobDetailsParams
                  title={"الدوام"}
                  value={`${workTypeOptions.find((option) => option.value === job?.workType)?.label}`}
                  icon={"clock-circle"}
                />
                <JobDetailsParams
                  title={"الخبرة"}
                  value={`${
                    experienceLevelOptions.find((option) => option.value === job?.experienceLevel)
                      ?.label
                  }`}
                  icon={"briefcase"}
                />
              </View>
              <View
                style={{
                  width: 198,
                  height: 1,
                  backgroundColor: Colors.primary,
                  marginHorizontal: "auto",
                  marginVertical: 20,
                }}
              ></View>
              <View>
                <Text style={styles.sectionTitle}>مزايا الوظيفة</Text>
                <View
                  style={{
                    flexDirection: isRTL() ? "row" : "row-reverse",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  {job?.jobFeatures.map((benefit, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontFamily: "RZ-Reg", color: "#404040", fontSize: 10 }}>
                        {benefit}
                      </Text>
                      {index < job.jobFeatures.length - 1 && (
                        <Text style={{ marginHorizontal: 8, color: Colors.primary }}>|</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.tabCard}>
        <TouchableOpacity
          style={{
            position: "absolute",
            zIndex: 10,
            left: isRTL() ? "auto" : 15,
            right: isRTL() ? 15 : "auto",
            top: 15,
          }}
          onPress={() => setIsRequirementsExpanded(!isRequirementsExpanded)}
        >
          <SvgIcon
            name="arrow-down-circle"
            size={20}
            color={Colors.primary}
            style={{ transform: [{ rotate: isRequirementsExpanded ? "180deg" : "0deg" }] }}
          />
        </TouchableOpacity>
        <View style={styles.requirementsParent}>
          <Text style={styles.sectionTitle}>متطلبات الفرصة</Text>
          {isRequirementsExpanded && (
            <View>
              {job?.requirements.split("\n").map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Job Description Card */}
      <View style={[styles.tabCard, { paddingBottom: 60 }]}>
        <TouchableOpacity
          style={{
            position: "absolute",
            zIndex: 10,
            left: isRTL() ? "auto" : 15,
            right: isRTL() ? 15 : "auto",
            top: 15,
          }}
          onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          <SvgIcon
            name="arrow-down-circle"
            size={20}
            color={Colors.primary}
            style={{ transform: [{ rotate: isDescriptionExpanded ? "180deg" : "0deg" }] }}
          />
        </TouchableOpacity>
        <View style={styles.requirementsParent}>
          <Text style={styles.sectionTitle}>الوصف الوظيفي</Text>
          {isDescriptionExpanded && (
            <View>
              {job?.description.split("\n").map((description, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.requirementText}>{description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderCompanyDetails = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>عن الشركة</Text>
      <Text style={styles.companyDescription}>{job?.company?.description}</Text>

      <View style={styles.companyInfoSection}>
        <Text style={styles.sectionTitle}>معلومات الشركة</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Image
                source={require("@/assets/images/location.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>الموقع</Text>
              <Text style={styles.infoValue}>
                {job?.company.location} {job?.company.city}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const { data: companyLogo } = useGetUploads(job?.company?.logo || "");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS == "ios" ? "light" : "light"} />

      <View style={styles.header}>
        <Image
          source={companyLogo ? { uri: companyLogo } : require("@/assets/images/wazfni-logo.png")}
          style={styles.companyLogo}
        />
        <View
          style={{
            display: "flex",
            flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
            gap: 8,
            flex: 1,
            alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
          }}
        >
          <TouchableOpacity onPress={toggleSave}>
            {job?.isBookmarked ? (
              <SvgIcon name="bookmark-bold" size={24} color={Colors.white} />
            ) : (
              <SvgIcon name="bookmark-linear" size={24} color={Colors.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <SvgIcon name="share-linear" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flex: 1, alignItems: I18nManager.isRTL ? "flex-start" : "flex-end" }}
        >
          <SvgIcon name="arrow-right" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={{ ...styles.card, borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
        <View style={styles.companyContainer}>
          <Text style={styles.jobTitle}>{job?.jobTitle}</Text>
          <Text style={styles.companyName}>{job?.company?.name}</Text>
          {job?.company?.description && (
            <Text style={styles.companyDescription}>{job?.company?.description}</Text>
          )}

          {job?.company?.location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                {job?.company.location} {job?.company.city}
              </Text>
              <SvgIcon name="map-pin" size={16} color={Colors.primary} />
            </View>
          )}
        </View>
      </View>

      <View style={{ backgroundColor: Colors.background.light, flex: 1, paddingBottom: 80 }}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "details" && styles.activeTab]}
            onPress={() => setActiveTab("details")}
          >
            <Text style={[styles.tabText, activeTab === "details" && styles.activeTabText]}>
              معلومات الوظيفة
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
              style={[styles.tab, activeTab === "company" && styles.activeTab]}
              onPress={() => setActiveTab("company")}
            >
              <Text style={[styles.tabText, activeTab === "company" && styles.activeTabText]}>
                معلومات عن الشركة
              </Text>
            </TouchableOpacity> */}
        </View>

        {/* Tab Content */}
        <View
          style={{
            display: activeTab === "details" ? "flex" : "none",
            paddingHorizontal: 20,
            backgroundColor: Colors.background.light,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: Colors.background.light }}
          >
            {renderJobDetails()}
          </ScrollView>
        </View>
        {/* <View style={{ display: activeTab === "company" ? "flex" : "none" }}>
            <ScrollView showsVerticalScrollIndicator={false}>{renderCompanyDetails()}</ScrollView>
          </View> */}
      </View>

      <View style={styles.applyButtonContainer}>
        <TouchableOpacity
          style={[
            styles.applyButton,
            myApplications?.some((application) => application.jobId === id) && {
              backgroundColor: Colors.background.medium,
            },
          ]}
          onPress={handleOpenModal}
          disabled={myApplications?.some((application) => application.jobId === id)}
        >
          <Text
            style={[
              styles.applyButtonText,
              myApplications?.some((application) => application.jobId === id) && {
                color: Colors.text.primary,
              },
            ]}
          >
            {myApplications?.some((application) => application.jobId === id)
              ? "تم التقديم"
              : "قدم الآن"}
          </Text>
        </TouchableOpacity>
      </View>

      <JobApplicationModal ref={applicationModalRef} jobId={id as string} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    position: "relative",
    paddingTop: Platform.OS === "ios" ? 20 : 48,
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    position: "relative",
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    position: "relative",
  },
  tabCard: {
    backgroundColor: Colors.background.light,
    position: "relative",
    marginTop: 20,
  },
  companyContainer: {
    position: "relative",
    backgroundColor: Colors.white,
    paddingTop: 40,
    gap: 14,
  },
  companyLogo: {
    position: "absolute",
    top: 30,
    left: isRTL() ? 16 : "auto",
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    backgroundColor: Colors.white,
    zIndex: 3,
  },
  companyName: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: "RZ-Reg",
    textAlign: isRTL() ? "left" : "right",
  },
  jobTitle: {
    fontSize: 20,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: isRTL() ? "left" : "right",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: "RZ-Reg",
  },
  infoRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
  },
  infoCard: {
    padding: 15,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  infoIconContainer: {
    alignItems: "flex-end",
  },
  infoTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginBottom: 5,
    fontFamily: "RZ-Reg",
  },
  infoValue: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.black,
    textAlign: I18nManager.isRTL ? "left" : "right",
    fontFamily: "RZ-Bold",
    marginBottom: 10,
  },
  requirementsParent: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.grey,
  },
  requirementItem: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  requirementText: {
    fontSize: 13,
    color: Colors.black,
    textAlign: I18nManager.isRTL ? "left" : "right",
    flex: 1,
    fontFamily: "RZ-Thin",
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 80,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  tabsContainer: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    backgroundColor: Colors.white,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
    paddingHorizontal: 20,
    gap: 30,
  },
  tab: {
    paddingBottom: 6,
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Bold",
  },
  activeTabText: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
  },
  companyDescription: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: "RZ-Reg",
    textAlign: isRTL() ? "left" : "right",
  },
  companyInfoSection: {
    marginTop: 20,
  },
  applyButtonContainer: {
    backgroundColor: Colors.white,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    height: 75,
    justifyContent: "center",
  },
});

export default JobDetailsScreen;
