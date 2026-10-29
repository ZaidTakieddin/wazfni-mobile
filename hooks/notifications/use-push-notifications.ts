import { useAuth } from "@/contexts/AuthContext";
import NotificationService, { NotificationPermissionStatus } from "@/services/notifications";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

export interface PushNotificationState {
  isLoading: boolean;
  permissionStatus: NotificationPermissionStatus | null;
  pushToken: string | null;
  isRegistered: boolean;
  error: string | null;
}

export const usePushNotifications = () => {
  const { user, token } = useAuth();
  const [state, setState] = useState<PushNotificationState>({
    isLoading: false,
    permissionStatus: null,
    pushToken: null,
    isRegistered: false,
    error: null,
  });

  // Request permissions and get push token
  const requestPermissions = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const permissionStatus = await NotificationService.requestPermissions();
      setState((prev) => ({ ...prev, permissionStatus }));

      if (permissionStatus.granted) {
        const pushToken = await NotificationService.getExpoPushToken();
        setState((prev) => ({ ...prev, pushToken }));

        if (pushToken && user) {
          const registered = await NotificationService.registerPushToken(pushToken);
          setState((prev) => ({ ...prev, isRegistered: registered }));
        }
      }
    } catch (error) {
      console.error("Error in requestPermissions:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  // Register push token with backend
  const registerToken = useCallback(
    async (customToken?: string) => {
      if (!user || !token) {
        console.warn("User not authenticated, cannot register push token");
        return false;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const success = await NotificationService.registerPushToken(customToken);
        setState((prev) => ({ ...prev, isRegistered: success }));
        return success;
      } catch (error) {
        console.error("Error registering push token:", error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to register push token",
        }));
        return false;
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [user, token]
  );

  // Remove push token from backend
  const removeToken = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await NotificationService.removePushToken();
      setState((prev) => ({
        ...prev,
        isRegistered: !success,
        pushToken: success ? null : prev.pushToken,
      }));
      return success;
    } catch (error) {
      console.error("Error removing push token:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to remove push token",
      }));
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Send test notification (Development only)
  const sendTestNotification = useCallback(async () => {
    if (!user || !token) {
      console.warn("User not authenticated, cannot send test notification");
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await NotificationService.sendTestNotification();
      return success;
    } catch (error) {
      console.error("Error sending test notification:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to send test notification",
      }));
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [user, token]);

  // Initialize notifications when user logs in
  useEffect(() => {
    if (user && token && Platform.OS !== "web") {
      // Configure notification channels (Android)
      NotificationService.configureNotificationChannels();

      // Setup notification listeners
      const unsubscribe = NotificationService.setupNotificationListeners();

      return unsubscribe;
    }
  }, [user, token]);

  // Auto-register push token when user logs in (if permissions already granted)
  useEffect(() => {
    if (
      user &&
      token &&
      state.permissionStatus?.granted &&
      state.pushToken &&
      !state.isRegistered
    ) {
      registerToken(state.pushToken);
    }
  }, [user, token, state.permissionStatus, state.pushToken, state.isRegistered, registerToken]);

  return {
    ...state,
    requestPermissions,
    registerToken,
    removeToken,
    sendTestNotification,
  };
};

export default usePushNotifications;
