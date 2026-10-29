import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

const RTL_SETUP_KEY = "rtl_setup_complete";

/**
 * Configure RTL settings for the application
 * This should be called only once at app initialization in _layout.tsx
 */
export const setupRTL = async (shouldBeRTL = true) => {
  try {
    // Force RTL to true regardless of device settings
    const forceRTL = true;

    // Apply RTL settings immediately
    I18nManager.allowRTL(forceRTL);
    I18nManager.forceRTL(forceRTL);

    // Check if we've already set up RTL to prevent reload loops
    const hasSetupRTL = await AsyncStorage.getItem(RTL_SETUP_KEY);

    // Only mark as setup if not already done, but don't reload
    if (!hasSetupRTL) {
      // Mark as setup to prevent future attempts
      await AsyncStorage.setItem(RTL_SETUP_KEY, "true");
      console.log("RTL setup completed without reload");
    }

    // Note: We removed the reload logic to prevent infinite loops
    // RTL will take effect on the next natural app restart
  } catch (error) {
    console.log("Error setting up RTL (non-critical):", error);
    // Ensure RTL is set even if storage fails
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
};

/**
 * Check if the app is currently in RTL mode
 * Always returns true since we want to force RTL layout
 */
export const isRTL = () => {
  return I18nManager.isRTL;
};

/**
 * Force RTL layout without async operations or reload
 * Call this directly in JSX components if needed
 */
export const forceRTLLayout = () => {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  return null;
};
