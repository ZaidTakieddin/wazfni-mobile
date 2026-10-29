import RHFPasswordInput from "@/components/RHF/RHFPasswordInput";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Colors } from "@/constants/Colors";
import { useGoogleSignIn } from "@/hooks/auth/use-google-signin";
import useLogin from "@/hooks/auth/use-login";
import { loginSchema } from "@/schemas/auth.schemas";
import { isRTL } from "@/utils/rtl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

export default function App() {
  const { control, handleSubmit } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLogin();
  const { handleGoogleSignIn, configureGoogleSignIn, isGoogleLoginPending, isDevBuild } =
    useGoogleSignIn();

  useEffect(() => {
    // Configure Google Sign-In only if running in development build
    const setupGoogleSignIn = async () => {
      await configureGoogleSignIn();
    };

    setupGoogleSignIn();
  }, [configureGoogleSignIn]);

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        {/* <Image source={require("@/assets/images/background.png")} style={styles.backgroundImage} /> */}
        <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <RHFTextInput
            control={control}
            name="email"
            label="البريد الإلكتروني"
            placeholder="البريد الإلكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <RHFPasswordInput
            control={control}
            name="password"
            label="كلمة المرور"
            placeholder="****************"
            autoCapitalize="none"
          />

          <Link href="/(auth)/forget-password" asChild>
            <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
          </Link>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, !isDevBuild && styles.disabledGoogleButton]}
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoginPending || !isDevBuild}
          >
            {isGoogleLoginPending ? (
              <ActivityIndicator size="small" color={Colors.text.primary} />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  style={[styles.googleIcon, !isDevBuild && styles.disabledIcon]}
                />
                <Text style={[styles.googleButtonText, !isDevBuild && styles.disabledText]}>
                  {isDevBuild ? "تسجيل دخول من خلال غوغل" : "غير متوفر في Expo Go"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>ليس لديك حساب؟</Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/register")}
              style={styles.signupLinkContainer}
            >
              <Text style={styles.signupLink}>إنشاء حساب</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 40,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 30,
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 12,
    textAlign: "left",
    marginBottom: 24,
    fontFamily: "RZ-Reg",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Reg",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    color: Colors.text.secondary,
    paddingHorizontal: 14,
    fontFamily: "RZ-Reg",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontFamily: "RZ-Reg",
  },
  signupContainer: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  signupText: {
    color: Colors.text.primary,
    fontSize: 12,
    fontFamily: "RZ-Reg",
  },
  signupLinkContainer: {},
  signupLink: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "RZ-Bold",
  },
  disabledGoogleButton: {
    backgroundColor: Colors.border.light,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
