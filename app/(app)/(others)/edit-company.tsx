import AvatarUploadModal from "@/components/AvatarUploadModal";
import RHFDropdown from "@/components/RHF/RHFDropdown";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useCreateMyCompany from "@/hooks/companies/use-create-my-company";
import useGetMyCompany from "@/hooks/companies/use-get-my-company";
import useUpdateMyCompany from "@/hooks/companies/use-update-my-company";
import useGetUploads from "@/hooks/use-get-uploads";
import { createCompanySchema, CreateCompanySchema } from "@/schemas/companies.schema";
import { CompanyApprovalStatus, CompanySize } from "@/types/companies";
import { isRTL } from "@/utils/rtl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
// Mock data for dropdowns
const companySizes = [
  "من 1 إلى 10 موظف",
  "من 11 إلى 25 موظف",
  "من 26 إلى 50 موظف",
  "من 51 إلى 100 موظف",
  "أكثر من 100 موظف",
];

const cities = ["دمشق", "حلب", "حمص", "اللاذقية", "طرطوس"];

export default function EditCompany() {
  const [isLogoModalVisible, setIsLogoModalVisible] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { control, handleSubmit, reset } = useForm<CreateCompanySchema>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      workField: "",
      city: "",
      website: "",
      size: CompanySize.EMPTY,
      location: "",
      tax_number: "",
      commercial_register: "",
    },
  });

  const { mutate: createCompany, isPending: isCreatingCompany } = useCreateMyCompany();

  const { data: myCompany } = useGetMyCompany();

  const { mutate: updateCompany, isPending: isUpdatingCompany } = useUpdateMyCompany();

  const { data: logoUri, isLoading: isLogoLoading } = useGetUploads(myCompany?.logo ?? "");

  const isImageLoading = isLogoLoading || isUpdatingCompany;

  useEffect(() => {
    if (myCompany?.id) {
      reset({
        ...myCompany,
        logo: myCompany.logo ? new File([myCompany.logo], myCompany.logo) : null,
      });
    }
  }, [myCompany, reset]);

  const onSubmit = (data: CreateCompanySchema) => {
    if (myCompany?.id) {
      // Update existing company
      updateCompany(
        { ...data },
        {
          onSuccess: () => {
            if (myCompany.approvalStatus === CompanyApprovalStatus.APPROVED) {
              router.replace("/(app)/(company)/company-profile");
            } else {
              setShowSuccessMessage(true);
            }
          },
        }
      );
    } else {
      // Create new company
      createCompany(data, {
        onSuccess: () => {
          setShowSuccessMessage(true);
        },
      });
    }
  };

  const handleLogoUpload = (formData: FormData) => {
    // Change the form field name from "avatar" to "logo" for company uploads
    const logoFormData = new FormData();
    const avatarData = formData.get("avatar");
    if (avatarData) {
      logoFormData.append("logo", avatarData);
    }

    updateCompany(logoFormData);
  };

  // Check if company is pending and prevent editing
  const isPendingApproval = myCompany?.approvalStatus === CompanyApprovalStatus.PENDING;
  const isRejected = myCompany?.approvalStatus === CompanyApprovalStatus.REJECTED;
  const isApproved = myCompany?.approvalStatus === CompanyApprovalStatus.APPROVED;

  // Show success message after creation or when pending
  if (showSuccessMessage || isPendingApproval) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>طلب إنشاء الشركة</Text>
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

        <View style={styles.messageContainer}>
          <View style={styles.successCard}>
            <SvgIcon name="sand-clock" size={60} color={Colors.warning} />
            <Text style={styles.successTitle}>تم إرسال طلبك بنجاح!</Text>
            <Text style={styles.successMessage}>
              طلب إنشاء الشركة قيد المراجعة. سيتم إشعارك عند الموافقة على الطلب أو في حالة الحاجة
              لتعديلات إضافية.
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>ماذا يحدث الآن؟</Text>
              <Text style={styles.infoText}>
                • مراجعة البيانات المقدمة{"\n"}• التحقق من صحة المستندات{"\n"}• الموافقة أو طلب
                تعديلات
              </Text>
            </View>
            {isPendingApproval && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.replace("/(app)/(main)/profile")}
              >
                <Text style={styles.primaryButtonText}>العودة للملف الشخصي</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {myCompany ? (isRejected ? "تعديل طلب الشركة" : "تعديل معلومات شركتي") : "إنشاء شركة"}
        </Text>
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

      {/* Show rejection reason if company was rejected */}
      {isRejected && myCompany?.rejectionReason && (
        <View style={styles.rejectionBanner}>
          <SvgIcon name="close-circle" size={20} color={Colors.danger} />
          <View style={styles.rejectionTextContainer}>
            <Text style={styles.rejectionTitle}>سبب الرفض:</Text>
            <Text style={styles.rejectionReason}>{myCompany.rejectionReason}</Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            {isImageLoading ? (
              <Skeleton
                isLoading={isImageLoading}
                layout={[{ key: "someId", width: 100, height: 100, borderRadius: 100 }]}
                containerStyle={styles.logo}
              />
            ) : (
              <Image
                source={logoUri ? { uri: logoUri } : require("@/assets/images/wazfni-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
            {myCompany && isApproved && (
              <TouchableOpacity
                style={styles.logoUploadButton}
                onPress={() => setIsLogoModalVisible(true)}
              >
                <SvgIcon name="pen-linear" size={10} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>

          <RHFTextInput control={control} name="name" label="اسم الشركة" placeholder="اسم الشركة" />

          <RHFTextInput
            control={control}
            name="description"
            label="وصف الشركة"
            placeholder="وصف الشركة"
            multiline={true}
          />

          <RHFTextInput
            control={control}
            name="workField"
            label="مجال العمل"
            placeholder="مجال العمل"
          />

          <RHFDropdown
            control={control}
            name="size"
            label="حجم الشركة"
            placeholder="اختر حجم الشركة"
            options={companySizes.map((size) => ({
              label: size,
              value: size,
            }))}
          />

          <RHFDropdown
            control={control}
            name="city"
            label="المدينة"
            placeholder="اختر المدينة"
            options={cities.map((city) => ({
              label: city,
              value: city,
            }))}
          />

          <RHFTextInput
            control={control}
            name="location"
            label="عنوان المقر"
            placeholder="عنوان مقر الشركة"
          />

          <RHFTextInput
            control={control}
            name="website"
            label="الموقع الإلكتروني"
            placeholder="الموقع الإلكتروني"
          />

          <RHFTextInput
            control={control}
            name="commercial_register"
            label="رقم السجل التجاري"
            placeholder="رقم السجل التجاري"
          />

          <RHFTextInput
            control={control}
            name="tax_number"
            label="الرقم الضريبي"
            placeholder="الرقم الضريبي"
          />
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          {isCreatingCompany || isUpdatingCompany ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>{myCompany ? "حفظ التعديلات" : "إرسال الطلب"}</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {myCompany && isApproved && (
        <AvatarUploadModal
          visible={isLogoModalVisible}
          onClose={() => setIsLogoModalVisible(false)}
          onUpload={handleLogoUpload}
        />
      )}
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
  rejectionBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderBottomWidth: 4,
    borderBottomColor: Colors.danger,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  rejectionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  rejectionTitle: {
    fontSize: 14,
    color: Colors.danger,
    fontFamily: "RZ-Bold",
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 12,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    lineHeight: 18,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  successTitle: {
    fontSize: 20,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "RZ-Bold",
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
    width: 100,
    height: 100,
    marginHorizontal: "auto",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
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
  logoUploadButton: {
    position: "absolute",
    bottom: 0,
    right: I18nManager.isRTL ? undefined : 12,
    left: I18nManager.isRTL ? 12 : undefined,
    borderRadius: 12,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
});
