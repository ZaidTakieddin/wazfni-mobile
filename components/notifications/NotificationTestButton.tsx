import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationTestButtonProps {
  style?: any;
  disabled?: boolean;
}

const NotificationTestButton: React.FC<NotificationTestButtonProps> = ({
  style,
  disabled = false,
}) => {
  const { sendTestNotification, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestNotification = async () => {
    if (!user) {
      Alert.alert("خطأ", "يجب تسجيل الدخول أولاً");
      return;
    }

    setIsLoading(true);

    try {
      const success = await sendTestNotification();

      if (success) {
        Alert.alert(
          "نجح الإرسال",
          "تم إرسال الإشعار التجريبي بنجاح! ستصلك الرسالة خلال ثوانٍ قليلة.",
          [{ text: "موافق" }]
        );
      } else {
        Alert.alert("فشل الإرسال", "فشل في إرسال الإشعار التجريبي. تأكد من تفعيل الإشعارات.", [
          { text: "موافق" },
        ]);
      }
    } catch (error) {
      console.error("Test notification error:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء إرسال الإشعار التجريبي", [{ text: "موافق" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={handleTestNotification}
      disabled={disabled || isLoading || !user}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.white} />
          <Text style={styles.loadingText}>جاري الإرسال...</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>اختبار الإشعارات</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  disabled: {
    backgroundColor: Colors.border.light,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "RZ-Bold",
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "RZ-Reg",
  },
});

export default NotificationTestButton;
