import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Colors } from "@/constants/Colors";
import useForgotPassword from "@/hooks/auth/use-forgot-password";
import { forgetPasswordSchema, ForgetPasswordSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const { mutate: sendForgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data: ForgetPasswordSchema) => {
    sendForgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
        Alert.alert(
          "تم الإرسال بنجاح",
          "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، فستصلك رسالة لإعادة تعيين كلمة المرور.",
          [
            {
              text: "موافق",
              onPress: () => router.back(),
            },
          ]
        );
      },
      onError: (error: any) => {
        console.error("Forgot password error:", error);
        Alert.alert(
          "خطأ",
          error?.response?.data?.message || "حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور",
          [{ text: "موافق" }]
        );
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        {/* <Image source={require("@/assets/images/background.png")} style={styles.backgroundImage} /> */}
        <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.title}>نسيت كلمة المرور</Text>
            <Text style={styles.subtitle}>سوف نرسل كود التفعيل إلى هاتفك للتأكيد</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>بريدك الإلكتروني</Text>
              <RHFTextInput
                control={control}
                name="email"
                placeholder="البريد الإلكتروني"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, isPending && styles.verifyButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.verifyButtonText}>إرسال رابط إعادة التعيين</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 30,
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
    marginBottom: 40,
  },
  inputLabel: {
    color: Colors.text.primary,
    fontSize: 14,
    marginBottom: 8,
    textAlign: "right",
    fontFamily: "RZ-Bold",
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
    textAlign: "center",
    fontFamily: "RZ-Bold",
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: "center",
    fontFamily: "RZ-Reg",
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  verifyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Reg",
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
});
