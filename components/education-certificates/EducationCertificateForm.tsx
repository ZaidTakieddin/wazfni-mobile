import RHFDropdown from "@/components/RHF/RHFDropdown";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Colors } from "@/constants/Colors";
import useCreateEducationCertificate from "@/hooks/education-certificates/use-create-education-certificate";
import useGetEducationCertificate from "@/hooks/education-certificates/use-get-education-certificate";
import useUpdateEducationCertificate from "@/hooks/education-certificates/use-update-education-certificate";
import {
  educationCertificateSchema,
  EducationCertificateSchema,
} from "@/schemas/education-certificates.schema";
import { degrees, months, years } from "@/types/enums";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

interface EducationCertificateFormProps {
  id?: string;
}

export default function EducationCertificateForm({ id }: EducationCertificateFormProps) {
  const { control, handleSubmit, reset } = useForm<EducationCertificateSchema>({
    resolver: zodResolver(educationCertificateSchema),
    defaultValues: {
      degree: "",
      university: "",
      certificateName: "",
      startYear: "",
      startMonth: "",
      endYear: "",
      endMonth: "",
    },
  });

  const { mutate: createEducationCertificate, isPending: isCreating } =
    useCreateEducationCertificate();
  const { mutate: updateEducationCertificate, isPending: isUpdating } =
    useUpdateEducationCertificate();

  const { data: educationCertificate } = useGetEducationCertificate(id as string);

  useEffect(() => {
    if (educationCertificate) {
      reset({
        ...educationCertificate,
        startYear: formatDate(educationCertificate.startDate, "YYYY"),
        startMonth: formatDate(educationCertificate.startDate, "M"),
        endYear: educationCertificate.endDate
          ? formatDate(educationCertificate.endDate, "YYYY")
          : undefined,
        endMonth: educationCertificate.endDate
          ? formatDate(educationCertificate.endDate, "M")
          : null,
      });
    }
  }, [educationCertificate, reset]);

  const onSubmit = (data: EducationCertificateSchema) => {
    const dataToSubmit = {
      ...data,
      startDate: new Date(`${data.startYear}-${data.startMonth}-01`).toISOString(),
      endDate:
        data.endYear && data.endMonth
          ? new Date(`${data.endYear}-${data.endMonth}-01`).toISOString()
          : null,
    };

    if (id) {
      updateEducationCertificate(
        {
          id: id as string,
          educationCertificate: dataToSubmit,
        },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
    } else {
      createEducationCertificate(dataToSubmit, {
        onSuccess: () => {
          router.back();
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{id ? "تعديل خبرة تعليمية" : "إضافة خبرة تعليمية"}</Text>
        <Link href="..">
          <Ionicons name="chevron-forward" size={24} color="#062C65" />
        </Link>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView>
          {/* Form Fields */}
          <View style={styles.content}>
            <RHFDropdown
              name="degree"
              control={control}
              options={degrees}
              placeholder="اختر الدرجة العلمية"
              label="الدرجة العلمية"
            />

            <RHFTextInput
              name="certificateName"
              control={control}
              placeholder="اسم الشهادة"
              label="اسم الشهادة"
            />

            <RHFTextInput
              name="university"
              control={control}
              placeholder="اسم الجامعة أو المعهد"
              label="الجامعة أو المعهد"
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>تاريخ البدء</Text>
              <View style={styles.dateRow}>
                <RHFDropdown
                  name="startYear"
                  control={control}
                  label="السنة"
                  placeholder="السنة"
                  options={years}
                  style={{ flex: 1 }}
                />
                <RHFDropdown
                  name="startMonth"
                  control={control}
                  label="الشهر"
                  placeholder="الشهر"
                  options={months}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>تاريخ الانتهاء</Text>
              <View style={styles.dateRow}>
                <RHFDropdown
                  name="endYear"
                  control={control}
                  label="السنة"
                  placeholder="السنة"
                  options={years}
                  style={{ flex: 1 }}
                />
                <RHFDropdown
                  name="endMonth"
                  control={control}
                  label="الشهر"
                  placeholder="الشهر"
                  options={months}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isCreating || isUpdating}
      >
        {isCreating || isUpdating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.addButtonText}>{id ? "تعديل" : "إضافة"}</Text>
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
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "flex-end",
    gap: 24,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 60,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    flex: 1,
    textAlign: isRTL() ? "left" : "right",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  content: {
    flex: 1,
    margin: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 1,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Bold",
  },
  dateRow: {
    flexDirection: "row",
    gap: 16,
  },
});
