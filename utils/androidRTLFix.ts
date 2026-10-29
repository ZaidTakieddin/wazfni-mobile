import { I18nManager, Platform, TextStyle, ViewStyle } from "react-native";

/**
 * Special utility to force RTL styles for problematic Android components
 * Some Android components don't respect RTL direction properly
 */
export const androidRTLStyles = (): ViewStyle => {
  if (Platform.OS !== "android") return {};

  return {
    // Force RTL direction explicitly
    direction: "rtl",
    // Add more specific RTL styles as needed
  };
};

/**
 * Special utility for text components that need RTL in Android
 */
export const androidRTLTextStyles = (): TextStyle => {
  if (Platform.OS !== "android") return {};

  return {
    textAlign: "right",
    writingDirection: "rtl",
  };
};

/**
 * Fix flexDirection for RTL layouts in Android
 * Use this in place of 'row' or 'row-reverse' in your style
 */
export const getFlexDirectionForRTL = (
  defaultDirection: "row" | "row-reverse" = "row"
): "row" | "row-reverse" => {
  if (Platform.OS !== "android") {
    return I18nManager.isRTL ? "row-reverse" : "row";
  }

  // On Android, we might need different behavior
  return I18nManager.isRTL ? "row-reverse" : "row";
};
