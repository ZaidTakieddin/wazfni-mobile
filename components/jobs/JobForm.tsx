import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { useGetCategoriesUnpaginated } from "@/hooks/categories/use-get-categories";
import { useGetSubcategoriesUnpaginated } from "@/hooks/categories/use-get-subcategories";
import useCreateJob from "@/hooks/jobs/use-create-job";
import useGetJob from "@/hooks/jobs/use-get-job";
import useUpdateJob from "@/hooks/jobs/use-update-job";
import { JobSchema, jobSchema } from "@/schemas/jobs.schema";
import {
  contractTypeOptions,
  experienceLevelOptions,
  JobBenefit,
  jobBenefits,
  salaryTypes,
  workTypeOptions,
} from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  I18nManager,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressSteps from "../ProgressSteps";
import RHFDropdown from "../RHF/RHFDropdown";
import RHFTextInput from "../RHF/RHFTextInput";

interface JobFormProps {
  id?: string;
}

const JobForm = ({ id }: JobFormProps) => {
  const router = useRouter();

  const { data: job } = useGetJob(id as string);

  // State for managing category selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobSchema>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: "",
      description: "",
      requirements: "",
      contractType: "ON_SITE",
      workType: "FULL_TIME",
      subCategoryIds: "",
      experienceLevel: "ENTRY",
      experienceYears: "",
      jobFeatures: [],
      questions: [],
      salaryType: "NONE",
      minSalary: "",
      maxSalary: "",
    },
  });

  console.log(errors);
  const salaryType = useWatch({ control, name: "salaryType" });
  const selectedSubcategoryId = watch("subCategoryIds");

  // Fetch categories and subcategories
  const { data: categories } = useGetCategoriesUnpaginated();
  const { data: subcategories } = useGetSubcategoriesUnpaginated(selectedCategoryId);

  useEffect(() => {
    if (job) {
      // Find the category ID from the job's first category
      const categoryId = job.subCategories[0]?.id || "";
      setSelectedCategoryId(categoryId);

      reset({
        ...job,
        subCategoryIds: "", // We'll need to get this from the job's relationship when API supports it
        minSalary: job?.minSalary?.toString(),
        maxSalary: job?.maxSalary?.toString(),
        experienceYears: job?.experienceYears?.toString(),
      });
      setBenefits((prev) =>
        prev.map((benefit) => ({
          ...benefit,
          selected: job.jobFeatures.includes(benefit.label),
        }))
      );
    }
  }, [job, reset]);

  // Watch for category changes and reset subcategory
  useEffect(() => {
    if (selectedCategoryId) {
      setValue("subCategoryIds", ""); // Reset subcategory when category changes
    }
  }, [selectedCategoryId, setValue]);

  const {
    fields: questions,
    append,
    remove,
  } = useFieldArray({
    control,
    //@ts-ignore
    name: "questions",
  });

  const onSubmit = (data: JobSchema) => {
    // Transform questions - filter out empty strings and ensure we have proper data
    const transformedQuestions = data.questions.filter((q: string) => q && q.trim().length > 0);

    const dataToSubmit = {
      ...data,
      jobFeatures: benefits.filter((benefit) => benefit.selected).map((benefit) => benefit.label),
      minSalary: data.salaryType === "NONE" ? 0 : Number(data?.minSalary) || 0,
      maxSalary: data.salaryType === "NONE" ? 0 : Number(data?.maxSalary) || 0,
      experienceYears: Number(data.experienceYears),
      subCategoryIds: [data.subCategoryIds],
      questions: transformedQuestions,
    };

    if (id) {
      // @ts-ignore
      updateJob(dataToSubmit, {
        onSuccess: () => {
          reset();
          setCurrentStep(4);
        },
        onError: (error: any) => {
          console.error("Update job error:", error);
        },
      });
    } else {
      // @ts-ignore
      createJob(dataToSubmit, {
        onSuccess: () => {
          reset();
          setCurrentStep(4);
        },
        onError: (error: any) => {
          console.error("Create job error:", error);
        },
      });
    }
  };

  const [currentStep, setCurrentStep] = useState(1);

  // Validation functions for each step
  const validateStep1 = async () => {
    const fields = [
      "jobTitle",
      "subCategoryIds",
      "workType",
      "contractType",
      "experienceLevel",
      "experienceYears",
      "minSalary",
      "maxSalary",
    ] as const;
    const result = await trigger(fields);
    return result;
  };

  const validateStep2 = async () => {
    const fields = ["description", "requirements"] as const;
    const result = await trigger(fields);
    return result;
  };

  const validateStep3 = async () => {
    const fields = ["questions"] as const;
    const result = await trigger(fields);
    return result;
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await validateStep1();
        break;
      case 2:
        isValid = await validateStep2();
        break;
      case 3:
        isValid = await validateStep3();
        break;
    }

    if (isValid) {
      if (currentStep === 3) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Job benefits
  const [benefits, setBenefits] = useState<JobBenefit[]>(jobBenefits);

  const toggleBenefit = (id: string) => {
    setBenefits(
      benefits.map((benefit) =>
        benefit.id === id ? { ...benefit, selected: !benefit.selected } : benefit
      )
    );
  };

  const addQuestion = () => {
    if (questions.length < 3) {
      append({ id: Math.random().toString(), question: "" });
    }
  };

  // Custom category dropdown component
  const CategoryDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>التصنيف</Text>
        <TouchableOpacity
          style={[styles.dropdown, isOpen && styles.dropdownActive]}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#8DA0BC" />
          <Text style={[styles.dropdownText, !selectedCategoryId && styles.placeholderText]}>
            {categories?.find((cat: any) => cat.id === selectedCategoryId)?.name || "اختر التصنيف"}
          </Text>
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
              {categories?.map((category: any) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategoryId(category.id);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCategoryId === category.id && styles.selectedItemText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderStep1 = () => (
    <ScrollView style={styles.formContainer}>
      <StatusBar style="dark" />
      <RHFTextInput
        control={control}
        name="jobTitle"
        label="المسمى الوظيفي"
        placeholder="المسمى الوظيفي"
      />

      {/* Category Dropdown */}
      <CategoryDropdown />

      {/* Subcategory Dropdown */}
      <RHFDropdown
        control={control}
        name="subCategoryIds"
        label="التصنيف الفرعي"
        placeholder={selectedCategoryId ? "اختر التصنيف الفرعي" : "اختر التصنيف أولاً"}
        options={
          subcategories?.map((subcategory: any) => ({
            label: subcategory.name,
            value: subcategory.id,
          })) || []
        }
        editable={!!selectedCategoryId}
      />

      <RHFDropdown
        control={control}
        name="workType"
        options={workTypeOptions}
        label="نوع العمل"
        placeholder="نوع العمل"
      />

      <RHFDropdown
        control={control}
        name="contractType"
        options={contractTypeOptions}
        label="نوع العقد"
        placeholder="نوع العقد"
      />

      <RHFDropdown
        control={control}
        name="experienceLevel"
        options={experienceLevelOptions}
        label="المستوى الوظيفي"
        placeholder="المستوى الوظيفي"
      />

      <RHFTextInput
        control={control}
        name="experienceYears"
        label="سنوات الخبرة"
        placeholder="سنوات الخبرة"
        keyboardType="numeric"
      />

      <RHFDropdown
        control={control}
        name="salaryType"
        options={salaryTypes}
        label="نوع الراتب"
        placeholder="نوع الراتب"
      />

      {salaryType === "FIXED" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>الراتب</Text>
          <RHFTextInput
            control={control}
            name="minSalary"
            placeholder="الراتب"
            keyboardType="numeric"
          />
        </View>
      )}

      {salaryType === "RANGE" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>مجال الراتب</Text>
          <View style={styles.salaryContainer}>
            <RHFTextInput
              control={control}
              name="maxSalary"
              placeholder="1000$"
              keyboardType="numeric"
              style={{ flex: 1, height: 60 }}
            />
            <Text style={styles.salarySeperator}>إلى</Text>
            <RHFTextInput
              control={control}
              name="minSalary"
              placeholder="500$"
              keyboardType="numeric"
              style={{ flex: 1, height: 60 }}
            />
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>مزايا الوظيفة</Text>
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit) => (
            <TouchableOpacity
              key={benefit.id}
              style={[styles.benefitChip, benefit.selected && styles.benefitChipSelected]}
              onPress={() => toggleBenefit(benefit.id)}
            >
              <Text style={[styles.benefitText, benefit.selected && styles.benefitTextSelected]}>
                {benefit.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.formContainer}>
      <RHFTextInput
        control={control}
        name="description"
        label="الوصف الوظيفي"
        description="المواصفات الخاصة بطبيعة العمل والمهام والمسؤليات الواجبة على الموظف القيام بها"
        placeholder="الوصف الوظيفي"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <RHFTextInput
        control={control}
        name="requirements"
        label="متطلبات الفرصة"
        description="اكتب المهارات والخبرات التي يفضل توافرها بالمتقدمين"
        placeholder="متطلبات الفرصة"
        multiline
        numberOfLines={6}
      />
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.formContainer}>
      <View style={styles.questionsContainer}>
        <Text style={styles.sectionTitle}>أسئلة التقديم</Text>
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionItem}>
            <RHFTextInput
              control={control}
              name={`questions.${index}`}
              placeholder="اكتب سؤالاً"
              style={{ flex: 1 }}
            />
            <TouchableOpacity style={styles.removeButton} onPress={() => remove(index)}>
              <Ionicons name="close-circle" size={24} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={[styles.addButton, questions.length >= 3 && styles.addButtonDisabled]}
          onPress={addQuestion}
          disabled={questions.length >= 3}
        >
          <Ionicons
            name="add-circle"
            size={24}
            color={questions.length >= 3 ? Colors.text.secondary : Colors.primary}
          />
          <Text
            style={[styles.addButtonText, questions.length >= 3 && styles.addButtonTextDisabled]}
          >
            إضافة سؤال
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: "40%",
          paddingHorizontal: 32,
        }}
      >
        <SvgIcon name="clock-linear" size={80} color={Colors.warning} />
        <Text
          style={{
            fontSize: 20,
            fontFamily: "RZ-Bold",
            color: Colors.primary,
            marginTop: 32,
            textAlign: "center",
          }}
        >
          {id ? "تم تعديل الوظيفة بنجاح" : "تم إضافة الوظيفة بنجاح"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "RZ-Reg",
            color: Colors.text.secondary,
            marginTop: 16,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          وظيفتك قيد المراجعة من فريق وظفني. ستصلك إشعارات بحالة المراجعة عبر التطبيق
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.background.light,
            borderWidth: 1,
            borderColor: Colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            marginTop: 24,
            flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
            alignItems: "center",
            gap: 8,
          }}
          onPress={() => router.replace("/(app)/(company)/pending-rejected-jobs")}
        >
          <SvgIcon name="clock-linear" size={16} color={Colors.primary} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "RZ-Reg",
              color: Colors.primary,
            }}
          >
            متابعة حالة الوظيفة
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob(id as string);
  return (
    <SafeAreaView style={styles.container}>
      {currentStep < 4 && (
        <ProgressSteps
          currentStep={currentStep}
          totalSteps={3}
          onBack={handleBack}
          onClose={() => {
            reset();
            setCurrentStep(1);
            router.back();
          }}
          title={id ? "تعديل الوظيفة" : "إضافة وظيفة"}
        />
      )}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      <View style={styles.footer}>
        {currentStep > 1 && currentStep !== 4 && (
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
            <Text style={styles.backButtonText}>السابق</Text>
          </TouchableOpacity>
        )}
        {currentStep !== 4 && (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? (id ? "تعديل" : "نشر") : "التالي"}
              </Text>
            )}
          </TouchableOpacity>
        )}
        {currentStep === 4 && (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => {
              router.replace("/(app)/(company)/pending-rejected-jobs");
              setCurrentStep(1);
            }}
          >
            <Text style={styles.nextButtonText}>متابعة حالة الوظيفة</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default JobForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  formContainer: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  dropdown: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.white,
    minHeight: 50,
  },
  dropdownActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    flex: 1,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  placeholderText: {
    color: Colors.text.secondary,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.border.medium,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  selectedItemText: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
  },
  salaryContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    width: "100%",
  },
  salarySeperator: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginHorizontal: 16,
    alignSelf: "center",
    height: 50,
  },
  benefitsContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    flexWrap: "wrap",
    gap: 16,
  },
  benefitChip: {
    backgroundColor: Colors.background.light,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  benefitChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  benefitText: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    lineHeight: 24,
  },
  benefitTextSelected: {
    color: Colors.white,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: Colors.background.light,
  },
  backButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: "RZ-Reg",
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
  questionsContainer: {
    flex: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 16,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  questionItem: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
  },
  removeButton: {
    padding: 8,
    marginBottom: 20,
  },
  addButton: {
    padding: 16,
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonTextDisabled: {
    color: Colors.text.secondary,
  },
});
