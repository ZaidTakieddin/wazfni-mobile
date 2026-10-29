import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Switch, View } from "react-native";

interface NotificationToggleProps {
  onToggle?: (enabled: boolean) => void;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({ onToggle }) => {
  const { requestNotificationPermissions, registerPushToken, removePushToken } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // You might want to check if notifications are already enabled
    // This could be stored in AsyncStorage or fetched from your backend
    // For now, we'll start with false
  }, []);

  const handleToggle = async (value: boolean) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (value) {
        // User wants to enable notifications
        const granted = await requestNotificationPermissions();

        if (granted) {
          const registered = await registerPushToken();
          if (registered) {
            setIsEnabled(true);
            onToggle?.(true);
          } else {
            Alert.alert("خطأ", "فشل في تفعيل الإشعارات. يرجى المحاولة مرة أخرى.", [
              { text: "موافق" },
            ]);
          }
        } else {
          Alert.alert(
            "الأذونات مطلوبة",
            "يرجى السماح بالإشعارات من إعدادات الجهاز لتلقي تحديثات الوظائف.",
            [
              { text: "إلغاء", style: "cancel" },
              {
                text: "فتح الإعدادات",
                onPress: () => {
                  // You can add deep linking to settings here if needed
                },
              },
            ]
          );
        }
      } else {
        // User wants to disable notifications
        const removed = await removePushToken();
        if (removed) {
          setIsEnabled(false);
          onToggle?.(false);
        } else {
          Alert.alert("خطأ", "فشل في إلغاء تفعيل الإشعارات. يرجى المحاولة مرة أخرى.", [
            { text: "موافق" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      Alert.alert("خطأ", "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.", [{ text: "موافق" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Switch
      value={isEnabled}
      onValueChange={handleToggle}
      trackColor={{ false: Colors.border.light, true: Colors.primary }}
      thumbColor={Colors.white}
      disabled={isLoading}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    width: 51, // Default width of Switch component
    height: 31, // Default height of Switch component
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotificationToggle;
