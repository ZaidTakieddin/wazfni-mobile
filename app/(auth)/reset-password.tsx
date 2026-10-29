import RHFPasswordInput from "@/components/RHF/RHFPasswordInput";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Colors } from "@/constants/Colors";
import useResetPassword from "@/hooks/auth/use-reset-password";
import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPassword(
      {
        token: data.token,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "تم بنجاح",
            "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
            [
              {
                text: "موافق",
                onPress: () => router.replace("/(auth)/login"),
              },
            ]
          );
        },
        onError: (error: any) => {
          console.error("Reset password error:", error);
          Alert.alert(
            "خطأ",
            error?.response?.data?.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور",
            [{ text: "موافق" }]
          );
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Image source={require("@/assets/images/background.png")} style={styles.backgroundImage} />
        <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
            <Text style={styles.subtitle}>أدخل كلمة مرور جديدة لحسابك</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>رمز إعادة التعيين</Text>
              <RHFTextInput
                control={control}
                name="token"
                placeholder="أدخل الرمز من البريد الإلكتروني"
                autoCapitalize="none"
                editable={!token} // If token comes from URL, make it readonly
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>كلمة المرور الجديدة</Text>
              <RHFPasswordInput
                control={control}
                name="newPassword"
                placeholder="كلمة المرور الجديدة"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>تأكيد كلمة المرور</Text>
              <RHFPasswordInput
                control={control}
                name="confirmPassword"
                placeholder="تأكيد كلمة المرور"
              />
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isPending && styles.resetButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.resetButtonText}>إعادة تعيين كلمة المرور</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.replace("/(auth)/login")}
              disabled={isPending}
            >
              <Text style={styles.backToLoginText}>العودة لتسجيل الدخول</Text>
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
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
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
    marginBottom: 16,
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
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Reg",
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  backToLoginButton: {
    padding: 12,
    alignItems: "center",
  },
  backToLoginText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: "RZ-Reg",
    textDecorationLine: "underline",
  },
});
