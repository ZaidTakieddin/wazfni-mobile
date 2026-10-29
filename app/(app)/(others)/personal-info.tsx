import RHFDropdown from "@/components/RHF/RHFDropdown";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetMe from "@/hooks/auth/use-get-me";
import useUpdateMe from "@/hooks/auth/use-update-me";
import { profileSchema, ProfileSchema } from "@/schemas/auth.schemas";
import { cities, days, degrees, genders, months, years } from "@/types/enums";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PersonalInfo() {
  const [cvFile, setCvFile] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      educationCertificate: "",
      cv: "",
      city: "",
      address: "",
      phone: "",
      birthDate: "",
      day: "",
      month: "",
      year: "",
      gender: "MALE",
    },
  });

  const { mutate: updatePersonalInfo, isPending: isUpdating } = useUpdateMe();

  const { data: user } = useGetMe();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        jobTitle: user.jobTitle || "",
        educationCertificate: user.educationCertificate || "",
        cv: user.cv || "",
        city: user.city || "",
        address: user.address || "",
        phone: user.phone || "",
        day: user.birthDate ? formatDate(user.birthDate, "D") : "",
        month: user.birthDate ? formatDate(user.birthDate, "M") : "",
        year: user.birthDate ? formatDate(user.birthDate, "YYYY") : "",
        gender: user.gender as "MALE" | "FEMALE",
      });
    }
  }, [user, reset]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (result.assets && result.assets.length > 0) {
        setCvFile(result.assets[0].name);
      }
    } catch (err) {}
  };

  const onSubmit = (data: ProfileSchema) => {
    if (!data.day || !data.month || !data.year) {
      Alert.alert("تاريخ الميلاد مطلوب");
      return;
    }

    const birthDate = new Date(`${data.year}-${data.month}-${data.day}`).toISOString();

    updatePersonalInfo(
      {
        ...data,
        birthDate,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المعلومات الشخصية</Text>
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

      <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }} keyboardVerticalOffset={80}>
        <ScrollView>
          <View style={styles.content}>
            <RHFTextInput
              control={control}
              name="firstName"
              label="الاسم الأول"
              placeholder="الاسم الأول"
            />
            <RHFTextInput
              control={control}
              name="lastName"
              label="الاسم الأخير"
              placeholder="الاسم الأخير"
            />
            <RHFTextInput
              control={control}
              name="jobTitle"
              label="المسمى الوظيفي"
              placeholder="المسمى الوظيفي"
            />

            <RHFDropdown
              control={control}
              name="educationCertificate"
              label="أعلى شهادة علمية"
              placeholder="اختر-شهادة"
              options={degrees}
            />

            <TouchableOpacity style={styles.uploadContainer} onPress={handleFilePick}>
              <View style={styles.uploadContent}>
                <SvgIcon name="attach-document" size={24} color="#004AAD" />
                <Text style={styles.uploadText}>{cvFile ? cvFile : "ارفع سيرتك الذاتية"}</Text>
                <Text style={styles.fileFormat}>Pdf,docx</Text>
              </View>
            </TouchableOpacity>

            <RHFTextInput
              control={control}
              name="phone"
              label="رقم الموبايل (اختياري)"
              placeholder="رقم الموبايل"
            />

            <RHFDropdown
              control={control}
              name="city"
              label="المدينة"
              placeholder="اختر المدينة"
              options={cities}
            />

            <RHFTextInput
              control={control}
              name="address"
              label="عنوان السكن"
              placeholder="عنوان السكن"
            />

            <Text style={styles.dateLabel}>تاريخ الميلاد</Text>
            <View style={styles.dateContainer}>
              <RHFDropdown
                control={control}
                name="day"
                label="اليوم"
                placeholder="اليوم"
                options={days}
                style={{ flex: 0.4 }}
              />
              <RHFDropdown
                control={control}
                name="month"
                label="الشهر"
                placeholder="الشهر"
                options={months}
                style={{ flex: 0.4 }}
              />
              <RHFDropdown
                control={control}
                name="year"
                label="السنة"
                placeholder="اختر السنة"
                options={years}
                style={{ flex: 1 }}
              />
            </View>

            <RHFDropdown
              control={control}
              name="gender"
              label="الجنس"
              placeholder="اختر الجنس"
              options={genders}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Text style={styles.saveButtonText}>حفظ</Text>
        )}
      </TouchableOpacity>
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
    justifyContent: "center",
    gap: 24,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    marginTop: Platform.OS === "ios" ? 6 : 0,
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  uploadContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  uploadContent: {
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  fileFormat: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Bold",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dateLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
});
