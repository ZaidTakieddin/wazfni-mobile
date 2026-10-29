import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetApplication from "@/hooks/jobs/use-get-application";
import useGetJob from "@/hooks/jobs/use-get-job";
import useUpdateJobApplication from "@/hooks/jobs/use-update-job-application";
import useDownloadFile from "@/hooks/use-download-file";
import useGetUploads from "@/hooks/use-get-uploads";
import { ApplicantStatus } from "@/types/applications";
import { degrees, genders } from "@/types/enums";
import { formatBirthDate, formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EvaluationBottomSheetProps {
  onSave: (status: ApplicantStatus) => void;
}

const EvaluationBottomSheet = React.forwardRef<BottomSheetModal, EvaluationBottomSheetProps>(
  ({ onSave }, ref) => {
    const [selectedStatus, setSelectedStatus] = useState<ApplicantStatus | null>(null);
    const snapPoints = React.useMemo(() => ["44%"], []);

    const handleSave = () => {
      if (selectedStatus) {
        onSave(selectedStatus);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={renderBackdrop}
        onChange={(index) => console.log("BottomSheetModal onChange:", index)}
        enableDynamicSizing={false}
        enableOverDrag={true}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.evaluationTitle}>تقييم الموظف</Text>

          <View style={styles.radioOptionsContainer}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSelectedStatus(ApplicantStatus.ACCEPTED)}
            >
              <Text style={styles.radioText}>مقبول</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedStatus === "ACCEPTED" && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSelectedStatus(ApplicantStatus.PENDING)}
            >
              <Text style={styles.radioText}>قيد الدراسة</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedStatus === ApplicantStatus.PENDING && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSelectedStatus(ApplicantStatus.REJECTED)}
            >
              <Text style={styles.radioText}>مرفوض</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedStatus === ApplicantStatus.REJECTED && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !selectedStatus && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!selectedStatus}
          >
            <Text style={styles.saveButtonText}>حفظ</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  }
);

EvaluationBottomSheet.displayName = "EvaluationBottomSheet";

export default function ApplicantDetails() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { id } = useLocalSearchParams();

  const { data: application } = useGetApplication(id as string);
  const { data: avatar } = useGetUploads(application?.applicant.profile.avatar || "");
  const { mutate: updateApplication } = useUpdateJobApplication();
  const { data: job } = useGetJob(application?.jobId || "");
  const { downloadFile } = useDownloadFile();

  // Accordion state
  const [expandedSections, setExpandedSections] = useState({
    questions: true,
    personalInfo: true,
    education: true,
    experience: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleEvaluationPress = useCallback(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  }, []);

  const handleSaveEvaluation = useCallback((status: ApplicantStatus) => {
    updateApplication(
      {
        applicationId: id as string,
        status,
      },
      {
        onSuccess: () => {
          bottomSheetRef.current?.dismiss();
        },
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <StatusBar style="light" />
      <View style={styles.header}>
        {/* <Image
          source={require("@/assets/images/background.png")}
          style={{ width: "100%", height: "100%" }}
        /> */}
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={avatar ? { uri: avatar } : require("@/assets/images/wazfni-logo.png")}
              style={styles.avatar}
            />
          </View>
        </View>
        <Text style={styles.name}>
          {application?.applicant.profile.firstName} {application?.applicant.profile.lastName}
        </Text>
        {application?.applicant?.profile?.address && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#004AAD" />
            <Text style={styles.location}>{application?.applicant?.profile?.address}</Text>
          </View>
        )}
        <TouchableOpacity
          style={{
            position: "absolute",
            right: isRTL() ? "auto" : 16,
            left: isRTL() ? 16 : "auto",
            top: 24,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-forward" size={24} color="#062C65" />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {application?.applicant.profile.phone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Linking.openURL(`tel:${application?.applicant.profile.phone}`)}
            >
              <SvgIcon name="phone-linear" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>اتصال</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (application?.cvPath) {
                downloadFile(
                  application.cvPath,
                  `${application.applicant.profile.firstName}_${application.applicant.profile.lastName}_CV`
                );
              }
            }}
          >
            <SvgIcon name="cv" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>السيرة الذاتية</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: 16,
            flex: 1,
          }}
        >
          {/* Questions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("questions")}
            >
              <Ionicons
                name={expandedSections.questions ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>الأسئلة</Text>
            </TouchableOpacity>

            {expandedSections.questions && (
              <View style={{ gap: 8 }}>
                {job?.questions.map((question, index) => (
                  <View key={index} style={{ flexDirection: "column" }}>
                    <Text style={styles.infoLabel}>{question}</Text>
                    <Text style={styles.infoValue}>{application?.answers[index]}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("personalInfo")}
            >
              <Ionicons
                name={expandedSections.personalInfo ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
            </TouchableOpacity>
            {expandedSections.personalInfo && (
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>العمر</Text>
                  <Text style={styles.infoValue}>
                    {application?.applicant?.profile?.birthDate
                      ? formatBirthDate(application?.applicant?.profile?.birthDate)
                      : "لا يوجد"}
                  </Text>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>الجنس</Text>
                    <Text style={styles.infoValue}>
                      {
                        genders.find(
                          (gender) => gender.value === application?.applicant?.profile?.gender
                        )?.label
                      }
                    </Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>المسمى الوظيفي</Text>
                  <Text style={styles.infoValue}>{application?.applicant?.profile?.jobTitle}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>المؤهل العلمي</Text>
                  <Text style={styles.infoValue}>
                    {
                      degrees.find(
                        (degree) =>
                          degree.value === application?.applicant?.profile?.educationCertificate
                      )?.label
                    }
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Education */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("education")}
            >
              <Ionicons
                name={expandedSections.education ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>التعليم</Text>
            </TouchableOpacity>
            {expandedSections.education && (
              <View>
                {application?.applicant?.profile?.educationCertificates?.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <Text style={styles.universityName}>{edu.university}</Text>
                    <Text style={styles.degree}>
                      {degrees.find((degree) => degree.value === edu.degree)?.label}
                    </Text>
                    <Text style={styles.period}>{edu.certificateName}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Experience */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("experience")}
            >
              <Ionicons
                name={expandedSections.experience ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>الخبرات</Text>
            </TouchableOpacity>
            {expandedSections.experience && (
              <View style={styles.experienceGrid}>
                {application?.applicant?.profile?.workExperiences?.map((exp) => (
                  <View key={exp.id} style={styles.experienceItem}>
                    <Text style={styles.position}>{exp.jobTitle}</Text>
                    <Text style={styles.company}>{exp.companyName}</Text>
                    <Text style={styles.period}>
                      {exp.startDate ? formatDate(exp.startDate, "DD/MM/YYYY") : "لا يوجد"} -{" "}
                      {exp.endDate ? formatDate(exp.endDate, "DD/MM/YYYY") : "حاليا"}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={{ backgroundColor: Colors.white, padding: 12 }}>
        <TouchableOpacity style={styles.evaluationButton} onPress={handleEvaluationPress}>
          <Text style={styles.evaluationButtonText}>تقييم الموظف</Text>
        </TouchableOpacity>
      </View>

      <EvaluationBottomSheet ref={bottomSheetRef} onSave={handleSaveEvaluation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    height: 111,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  profileSection: {
    backgroundColor: Colors.background.light,
    alignItems: "center",
    paddingVertical: 24,
    width: "100%",
    gap: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  avatarContainer: {},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  name: {
    fontSize: 20,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
  },
  locationContainer: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  actionButtons: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 16,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "right",
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    alignItems: "center",
    flexDirection: isRTL() ? "row" : "row-reverse",
    gap: 24,
    width: "100%",
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginBottom: 4,
    textAlign: isRTL() ? "left" : "right",
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: isRTL() ? "left" : "right",
  },
  educationItem: {
    alignItems: isRTL() ? "flex-start" : "flex-end",
    marginBottom: 16,
    backgroundColor: Colors.background.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  universityName: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 4,
  },
  degree: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginBottom: 4,
  },
  period: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  experienceGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 16,
  },
  experienceItem: {
    alignItems: isRTL() ? "flex-start" : "flex-end",
    backgroundColor: Colors.background.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },
  position: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginBottom: 4,
  },
  evaluationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    margin: 16,
  },
  evaluationButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  bottomSheetBackground: {
    backgroundColor: Colors.background.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: Colors.border.light,
    width: 40,
  },
  bottomSheetContent: {
    padding: 24,
    gap: 16,
    flex: 1,
  },
  evaluationTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
  },
  radioOptionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  radioOption: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    flex: 1,
    minHeight: 48,
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.text.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    marginTop: "auto",
  },
  saveButtonText: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: "RZ-Bold",
    textAlign: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
});
