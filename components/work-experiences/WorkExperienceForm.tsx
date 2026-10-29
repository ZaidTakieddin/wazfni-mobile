import RHFCheckbox from "@/components/RHF/RHFCheckbox";
import RHFDropdown from "@/components/RHF/RHFDropdown";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Colors } from "@/constants/Colors";
import useCreateWorkExperience from "@/hooks/work-experiences/use-create-work-experience";
import useGetWorkExperience from "@/hooks/work-experiences/use-get-work-experience";
import useUpdateWorkExperience from "@/hooks/work-experiences/use-update-work-experience";
import { workExperienceSchema, WorkExperienceSchema } from "@/schemas/work-experiences.schema";
import { months, years } from "@/types/enums";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import SvgIcon from "../SvgIcon";
interface WorkExperienceFormProps {
  id?: string;
}

export default function WorkExperienceForm({ id }: WorkExperienceFormProps) {
  const { data: workExperience } = useGetWorkExperience(id as string);

  const { control, handleSubmit, reset } = useForm<WorkExperienceSchema>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      startYear: "",
      startMonth: "",
      endYear: "",
      endMonth: "",
      description: "",
      current: false,
    },
  });

  const { mutate: createWorkExperience, isPending: isCreatingWorkExperience } =
    useCreateWorkExperience();
  const { mutate: updateWorkExperience, isPending: isUpdatingWorkExperience } =
    useUpdateWorkExperience();

  const current = useWatch({ control, name: "current" });

  const onSubmit = (data: WorkExperienceSchema) => {
    const dataToSubmit = {
      ...data,
      startDate: new Date(`${data.startYear}-${data.startMonth}-01`).toISOString(),
      endDate: data.current ? null : new Date(`${data.endYear}-${data.endMonth}-01`).toISOString(),
    };

    if (id) {
      updateWorkExperience(
        {
          id: id as string,
          workExperience: dataToSubmit,
        },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
    } else {
      createWorkExperience(dataToSubmit, {
        onSuccess: () => {
          router.back();
        },
      });
    }
  };

  useEffect(() => {
    if (workExperience) {
      reset({
        ...workExperience,
        startYear: formatDate(workExperience.startDate, "YYYY"),
        startMonth: formatDate(workExperience.startDate, "M"),
        endYear: workExperience.endDate ? formatDate(workExperience.endDate, "YYYY") : undefined,
        endMonth: workExperience.endDate ? formatDate(workExperience.endDate, "M") : undefined,
      });
    }
  }, [workExperience, reset]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{id ? "تعديل خبرة عملية" : "إضافة خبرة عملية"}</Text>
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <RHFTextInput
            name="jobTitle"
            control={control}
            label="المسمى الوظيفي"
            placeholder="المسمى الوظيفي"
          />

          <RHFTextInput
            name="companyName"
            control={control}
            label="اسم الشركة"
            placeholder="اسم الشركة"
          />

          <RHFTextInput
            name="description"
            control={control}
            label="الوصف"
            placeholder="الوصف"
            multiline
            numberOfLines={4}
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

          {!current && (
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
                  editable={!current}
                />
                <RHFDropdown
                  name="endMonth"
                  control={control}
                  label="الشهر"
                  placeholder="الشهر"
                  options={months}
                  style={{ flex: 1 }}
                  editable={!current}
                />
              </View>
            </View>
          )}

          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>أنا أعمل حالياً في هذه الوظيفة</Text>
            <RHFCheckbox
              name="current"
              control={control}
              label="أنا أعمل حالياً في هذه الوظيفة"
              style={styles.checkbox}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isCreatingWorkExperience || isUpdatingWorkExperience}
      >
        {isCreatingWorkExperience || isUpdatingWorkExperience ? (
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
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  content: {
    flex: 1,
    margin: 16,
  },
  fieldContainer: {
    marginBottom: 24,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  dateRow: {
    flexDirection: "row",
    gap: 16,
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: I18nManager.isRTL ? "flex-end" : "flex-start",
    alignItems: "flex-end",
    marginBottom: 24,
    gap: 8,
  },
  checkbox: {
    margin: 0,
    height: 20,
    width: 20,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 4,
  },
  checkboxLabel: {
    fontSize: 14,
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
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Bold",
  },
});
