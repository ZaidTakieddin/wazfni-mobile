import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for the applicant
const applicantData = {
  name: "Tala Kareesh",
  location: "المركز دمشق",
  avatar: require("@/assets/images/wazfni.png"),
  personalInfo: {
    age: "25 سنة",
    gender: "أنثى",
    jobTitle: "مصمم UI/UX",
    education: "شهادة جامعية",
  },
  education: [
    {
      id: "1",
      university: "جامعة دمشق",
      degree: "هندسة اتصالات والكترونيات, شهادة جامعية",
      period: "1/2017 - 1/2020",
    },
  ],
  experience: [
    {
      id: "1",
      position: "مصمم UI/UX",
      company: "شركة فيسبوك",
      period: "1/2017 - 1/2020",
    },
    {
      id: "2",
      position: "مصمم UI/UX",
      company: "شركة فيسبوك",
      period: "1/2017 - 1/2020",
    },
    {
      id: "3",
      position: "مصمم UI/UX",
      company: "شركة فيسبوك",
      period: "1/2018 - 1/2020",
    },
  ],
};

type EvaluationStatus = "مقبول" | "قيد الدراسة" | "مرفوض" | null;

interface EvaluationBottomSheetProps {
  onSave: (status: EvaluationStatus) => void;
}

const EvaluationBottomSheet = React.forwardRef<BottomSheetModal, EvaluationBottomSheetProps>(
  ({ onSave }, ref) => {
    const [selectedStatus, setSelectedStatus] = useState<EvaluationStatus>(null);
    const snapPoints = React.useMemo(() => ["50%"], []);

    const handleSave = () => {
      if (selectedStatus) {
        onSave(selectedStatus);
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss();
        }
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
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        android_keyboardInputMode="adjustResize"
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.evaluationTitle}>تقييم الموظف</Text>

          <TouchableOpacity style={styles.radioOption} onPress={() => setSelectedStatus("مقبول")}>
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {selectedStatus === "مقبول" && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.radioText}>مقبول</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setSelectedStatus("قيد الدراسة")}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {selectedStatus === "قيد الدراسة" && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.radioText}>قيد الدراسة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.radioOption} onPress={() => setSelectedStatus("مرفوض")}>
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {selectedStatus === "مرفوض" && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.radioText}>مرفوض</Text>
          </TouchableOpacity>

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

  const handleEvaluationPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSaveEvaluation = useCallback((status: EvaluationStatus) => {
    // Implement your save logic here
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/background.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={{
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            backgroundColor: Colors.background.light,
            paddingHorizontal: 16,
          }}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.infoContainer}>
              <View style={styles.avatarContainer}>
                <Image source={applicantData.avatar} style={styles.avatar} />
              </View>
            </View>
            <Text style={styles.name}>{applicantData.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#004AAD" />
              <Text style={styles.location}>{applicantData.location}</Text>
            </View>
            <TouchableOpacity
              style={{ position: "absolute", right: 0, top: 24 }}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-forward" size={24} color="#062C65" />
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call-outline" size={20} color="#004AAD" />
                <Text style={styles.actionButtonText}>اتصال</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document-text-outline" size={20} color="#004AAD" />
                <Text style={styles.actionButtonText}>CV</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>العمر</Text>
                <Text style={styles.infoValue}>{applicantData.personalInfo.age}</Text>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>الجنس</Text>
                  <Text style={styles.infoValue}>{applicantData.personalInfo.gender}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>المسمى الوظيفي</Text>
                <Text style={styles.infoValue}>{applicantData.personalInfo.jobTitle}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>المؤهل العلمي</Text>
                <Text style={styles.infoValue}>{applicantData.personalInfo.education}</Text>
              </View>
            </View>
          </View>

          {/* Education */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التعليم</Text>
            {applicantData.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <Text style={styles.universityName}>{edu.university}</Text>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.period}>{edu.period}</Text>
              </View>
            ))}
          </View>

          {/* Experience */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الخبرات</Text>
            <View style={styles.experienceGrid}>
              {applicantData.experience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <Text style={styles.position}>{exp.position}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.period}>{exp.period}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.evaluationButton} onPress={handleEvaluationPress}>
        <Text style={styles.evaluationButtonText}>تقييم الموظف</Text>
      </TouchableOpacity>

      <EvaluationBottomSheet ref={bottomSheetRef} onSave={handleSaveEvaluation} />
    </SafeAreaView>
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
    backgroundColor: Colors.primary,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    width: "100%",
    gap: 16,
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
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.background.light,
    paddingVertical: 12,
    borderRadius: 16,
    width: "45%",
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  section: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 16,
    textAlign: "right",
    paddingTop: 16,
  },
  infoGrid: {
    gap: 33,
  },
  infoItem: {
    alignItems: "center",
    flexDirection: "row-reverse",
    gap: 24,
    width: "100%",
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  educationItem: {
    alignItems: "flex-end",
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
    alignItems: "flex-end",
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
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    margin: 16,
  },
  evaluationButtonText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
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
  },
  evaluationTitle: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 12,
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
    borderColor: Colors.primary,
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
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
});
