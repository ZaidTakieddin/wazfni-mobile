import { Colors } from "@/constants/Colors";
import useGetUploads from "@/hooks/use-get-uploads";
import { ApplicantStatus, Application } from "@/types/applications";
import { degrees } from "@/types/enums";
import { isRTL } from "@/utils/rtl";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ApplicantCard = ({ application }: { application: Application }) => {
  console.log(application);

  const { data: avatar } = useGetUploads(application.applicant.profile.avatar || "");

  return (
    <TouchableOpacity
      style={styles.applicantCard}
      onPress={() =>
        router.push({
          pathname: "/(app)/(others)/applicant/[id]",
          params: { id: application.id },
        })
      }
    >
      <View style={styles.applicantInfo}>
        <View style={styles.applicantDetails}>
          <Text
            style={[
              styles.status,
              application.status === ApplicantStatus.REJECTED && { color: Colors.danger },
              application.status === ApplicantStatus.ACCEPTED && { color: Colors.success },
              application.status === ApplicantStatus.PENDING && { color: Colors.primary },
            ]}
          >
            {application.status === ApplicantStatus.PENDING
              ? "قيد المعاينة"
              : application.status === ApplicantStatus.ACCEPTED
                ? "مقبول"
                : "مرفوض"}
          </Text>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {application.applicant.profile.firstName} {application.applicant.profile.lastName}
            </Text>
            <Text style={styles.position}>{application.applicant.profile.jobTitle}</Text>
            <View style={styles.educationContainer}>
              <Text style={styles.educationText}>
                {
                  degrees.find(
                    (degree) => degree.value === application.applicant.profile.educationCertificate
                  )?.label
                }
              </Text>
            </View>
          </View>
        </View>
        <Image
          source={avatar ? { uri: avatar } : require("@/assets/images/wazfni-logo.png")}
          style={styles.avatar}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ApplicantCard;

const styles = StyleSheet.create({
  applicantCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingTop: 16,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  applicantInfo: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 24,
    marginBottom: 8,
  },
  applicantDetails: {
    flex: 1,
    flexDirection: isRTL() ? "row" : "row-reverse",
  },
  status: {
    fontSize: 10,
    fontFamily: "RZ-Bold",
    alignSelf: "flex-start",
    marginBottom: 4,
    position: "absolute",
    left: isRTL() ? "auto" : 0,
    right: isRTL() ? 0 : "auto",
    top: -6,
  },
  nameContainer: {
    alignItems: isRTL() ? "flex-start" : "flex-end",
    gap: 4,
  },
  name: {
    fontSize: 12,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
  },
  position: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  educationContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  educationText: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
});
