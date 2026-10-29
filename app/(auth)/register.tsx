import RHFPasswordInput from "@/components/RHF/RHFPasswordInput";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Colors } from "@/constants/Colors";
import useRegister from "@/hooks/auth/use-register";
import { registerSchema, RegisterSchema } from "@/schemas/auth.schemas";
import { isRTL } from "@/utils/rtl";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (data: RegisterSchema) => {
    register(data);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          {/* <Image
            source={require("@/assets/images/background.png")}
            style={styles.backgroundImage}
          /> */}
          <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
        </View>

        <View style={styles.content}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <RHFTextInput
                control={control}
                name="firstName"
                placeholder="الاسم الأول"
                label="الاسم الأول"
              />

              <RHFTextInput
                control={control}
                name="lastName"
                placeholder="الاسم الأخير"
                label="الاسم الأخير"
              />

              <RHFTextInput
                control={control}
                name="email"
                placeholder="البريد الإلكتروني"
                label="البريد الإلكتروني"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <RHFTextInput
                control={control}
                name="phoneNumber"
                placeholder="09XXXXXXXXX"
                label="رقم الموبايل"
                keyboardType="phone-pad"
              />

              <RHFPasswordInput
                control={control}
                name="password"
                placeholder="****************"
                label="كلمة المرور"
              />

              <RHFPasswordInput
                control={control}
                name="confirmPassword"
                placeholder="****************"
                label="تأكيد كلمة المرور"
              />

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  <View style={[styles.checkboxInner, agreeToTerms && styles.checkboxChecked]} />
                </TouchableOpacity>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>أوافق على </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(app)/(others)/terms-conditions")}
                    style={styles.linkButton}
                  >
                    <Text style={styles.linkText}>الشروط والأحكام</Text>
                  </TouchableOpacity>
                  <Text style={styles.termsText}> و </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(app)/(others)/privacy-policy")}
                    style={styles.linkButton}
                  >
                    <Text style={styles.linkText}>سياسة الخصوصية</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.registerButton, !agreeToTerms && styles.registerButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={!agreeToTerms || isPending}
              >
                {isPending ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.registerButtonText}>إنشاء حساب</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>لديك حساب؟</Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/login")}
                  style={styles.loginLinkContainer}
                >
                  <Text style={styles.loginLink}>تسجيل دخول</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  logo: {
    width: 250,
    height: 150,
    alignSelf: "center",
    verticalAlign: "top",
    marginTop: 40,
  },
  header: {
    height: 200,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "RZ-Bold",
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  termsContainer: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: isRTL() ? "row" : "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
  },
  termsText: {
    color: Colors.text.primary,
    fontSize: 12,
    fontFamily: "RZ-Reg",
    textAlign: isRTL() ? "left" : "right",
  },
  linkButton: {
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "RZ-Reg",
    textDecorationLine: "underline",
    textAlign: isRTL() ? "left" : "right",
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Reg",
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loginLinkContainer: {},
  loginText: {
    color: Colors.text.primary,
    fontSize: 12,
    fontFamily: "RZ-Reg",
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "RZ-Bold",
  },
});
