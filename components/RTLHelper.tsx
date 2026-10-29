import React, { useEffect } from "react";
import { I18nManager, Platform } from "react-native";

/**
 * Helper component that ensures RTL is applied throughout the app
 * Place this at the top level of your app or in individual screens
 */
export const RTLEnforcer = ({ children }: { children?: React.ReactNode }) => {
  useEffect(() => {
    // Force RTL settings every time a component mounts
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    // For Android, we need to make extra sure this works
    if (Platform.OS === "android") {
      // Force text alignment right for Arabic text
      const textStyles = { textAlign: "right" as const };
      // Return a cleanup function that runs when component unmounts
      return () => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      };
    }

    return undefined;
  }, []);

  return <>{children}</>;
};

/**
 * Utility function to force RTL styles for any component
 * Use this for components that aren't properly respecting RTL
 */
export const getForceRTLStyle = () => {
  return Platform.OS === "android"
    ? {
        transform: [{ scaleX: -1 }],
        direction: "rtl",
      }
    : {};
};

export default RTLEnforcer;
