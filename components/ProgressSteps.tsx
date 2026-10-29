import { Colors } from "@/constants/Colors";
import { isRTL } from "@/utils/rtl";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { I18nManager, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  title: string;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export default function ProgressSteps({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onClose,
  title,
  isNextDisabled = false,
  nextLabel = "التالي",
}: ProgressStepsProps) {
  const progress = (currentStep / totalSteps) * 360;

  return (
    <View style={styles.stepperContainer}>
      <View
        style={{
          paddingLeft: 12,
          flex: 1,
          alignItems: I18nManager.isRTL ? "flex-end" : "flex-start",
        }}
      >
        <View style={styles.progressCircle}>
          <View style={[styles.progressArc, { transform: [{ rotate: `${progress}deg` }] }]} />
          <View style={styles.stepText}>
            <Text style={styles.stepFraction}>
              <Text style={{ fontFamily: "RZ-Bold" }}>{currentStep}</Text>
              <Text style={{ fontFamily: "RZ-Bold" }}>/</Text>
              <Text style={{ fontFamily: "RZ-Bold" }}>{totalSteps}</Text>
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.screenTitle}>{title}</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  progressCircle: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    flex: 1,
  },
  progressArc: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
    position: "absolute",
  },
  stepText: {
    borderRadius: 12,
    padding: 4,
  },
  stepFraction: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    flexDirection: "row",
    alignItems: "center",
    height: 25,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: I18nManager.isRTL ? "flex-start" : "flex-end",
    gap: 24,
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    flex: 1,
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
});
