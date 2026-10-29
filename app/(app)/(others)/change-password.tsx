import RHFPasswordInput from "@/components/RHF/RHFPasswordInput";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useChangePassword from "@/hooks/auth/use-change-password";
import { changePasswordSchema, ChangePasswordSchema } from "@/schemas/auth.schemas";
import { isRTL } from "@/utils/rtl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChangePassword() {
  const { control, handleSubmit } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (data: ChangePasswordSchema) => {
    changePassword(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تعديل كلمة المرور</Text>
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

      <View style={styles.content}>
        <RHFPasswordInput
          name="currentPassword"
          control={control}
          placeholder="كلمة المرور القديمة"
          label="كلمة المرور القديمة"
        />

        <RHFPasswordInput
          name="newPassword"
          control={control}
          placeholder="كلمة المرور الجديدة"
          label="كلمة المرور الجديدة"
        />

        <RHFPasswordInput
          name="confirmPassword"
          control={control}
          placeholder="تأكيد كلمة المرور"
          label="تأكيد كلمة المرور"
        />
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text style={styles.resetButtonText}>
          {isPending ? <ActivityIndicator size="small" color={Colors.white} /> : "إعادة تعيين"}
        </Text>
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
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
  },
  content: {
    padding: 16,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Bold",
    textAlign: "center",
    width: "100%",
  },
});
