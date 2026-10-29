import axiosInstance from "@/utils/axiosInstance";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain?: boolean;
  status: Notifications.PermissionStatus;
}

export interface ExpoPushToken {
  data: string;
  type: string;
}

class NotificationService {
  private pushToken: string | null = null;

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<NotificationPermissionStatus> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowDisplayInCarPlay: true,
            allowCriticalAlerts: false,
            provideAppNotificationSettings: true,
            allowProvisional: false,
            // allowAnnouncements: false,
          },
        });
        finalStatus = status;
      }

      return {
        granted: finalStatus === "granted",
        canAskAgain: finalStatus === "undetermined",
        status: finalStatus,
      };
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return {
        granted: false,
        status: Notifications.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Get the Expo push token for this device
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn("Push notifications only work on physical devices");
        return null;
      }

      const { granted } = await this.requestPermissions();
      if (!granted) {
        console.warn("Notification permissions not granted");
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.pushToken = tokenData.data;
      return tokenData.data;
    } catch (error) {
      console.error("Error getting Expo push token:", error);
      return null;
    }
  }

  /**
   * Register push token with the backend
   */
  async registerPushToken(token?: string): Promise<boolean> {
    try {
      const pushToken = token || this.pushToken || (await this.getExpoPushToken());

      if (!pushToken) {
        console.warn("No push token available to register");
        return false;
      }

      await axiosInstance.post("/fcm/register", {
        token: pushToken,
        platform: Platform.OS,
      });

      console.log("Push token registered successfully");
      return true;
    } catch (error) {
      console.error("Error registering push token:", error);
      return false;
    }
  }

  /**
   * Remove push token from the backend
   */
  async removePushToken(token?: string): Promise<boolean> {
    try {
      const pushToken = token || this.pushToken;

      if (!pushToken) {
        console.warn("No push token available to remove");
        return false;
      }

      await axiosInstance.post("/fcm/remove", {
        token: pushToken,
      });

      console.log("Push token removed successfully");
      this.pushToken = null;
      return true;
    } catch (error) {
      console.error("Error removing push token:", error);
      return false;
    }
  }

  /**
   * Send test notification (Development only)
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      const response = await axiosInstance.post("/fcm/test");
      console.log("Test notification sent:", response.data);
      return true;
    } catch (error) {
      console.error("Error sending test notification:", error);
      return false;
    }
  }

  /**
   * Configure notification channels for Android and categories for iOS
   */
  async configureNotificationChannels(): Promise<void> {
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default notifications",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#004AAD",
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: false,
        });

        await Notifications.setNotificationChannelAsync("job_alerts", {
          name: "Job Alerts",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#004AAD",
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: false,
          description: "Notifications for new job opportunities",
        });

        await Notifications.setNotificationChannelAsync("application_updates", {
          name: "Application Updates",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#004AAD",
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: false,
          description: "Updates on your job applications",
        });

        console.log("Android notification channels configured");
      } catch (error) {
        console.error("Error configuring notification channels:", error);
      }
    } else if (Platform.OS === "ios") {
      try {
        // Configure iOS notification categories
        await Notifications.setNotificationCategoryAsync("job_alert", [
          {
            identifier: "view_job",
            buttonTitle: "View Job",
            options: {
              opensAppToForeground: true,
            },
          },
          {
            identifier: "save_job",
            buttonTitle: "Save",
            options: {
              opensAppToForeground: false,
            },
          },
        ]);

        await Notifications.setNotificationCategoryAsync("application_update", [
          {
            identifier: "view_application",
            buttonTitle: "View Application",
            options: {
              opensAppToForeground: true,
            },
          },
        ]);

        await Notifications.setNotificationCategoryAsync("default", [
          {
            identifier: "open_app",
            buttonTitle: "Open App",
            options: {
              opensAppToForeground: true,
            },
          },
        ]);

        console.log("iOS notification categories configured");
      } catch (error) {
        console.error("Error configuring iOS notification categories:", error);
      }
    }
  }

  /**
   * Setup notification listeners
   */
  setupNotificationListeners() {
    // Handle notification received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);

      // For iOS, you can show custom UI or update app state
      // The notification will be displayed according to setNotificationHandler config
    });

    // Handle notification response (when user taps on notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);

      const data = response.notification.request.content.data;
      const actionIdentifier = response.actionIdentifier;

      // Handle action buttons (iOS specific)
      if (actionIdentifier && actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
        this.handleNotificationAction(actionIdentifier, data);
        return;
      }

      // Navigate based on notification type
      try {
        if (data?.type === "job_alert" && data?.jobId) {
          router.push(`/(app)/(job)/details/${data.jobId}`);
        } else if (data?.type === "application_update") {
          router.push("/(app)/(main)/applied-jobs");
        } else if (data?.type === "company_approval") {
          router.push("/(app)/(main)/profile");
        } else if (data?.route) {
          router.push(data.route as any);
        } else {
          router.push("/(app)/(others)/notifications");
        }
      } catch (error) {
        console.error("Error navigating from notification:", error);
        router.push("/(app)/(main)/main");
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }

  /**
   * Handle iOS notification action buttons
   */
  private handleNotificationAction(actionIdentifier: string, data: any) {
    switch (actionIdentifier) {
      case "view_job":
        if (data?.jobId) {
          router.push(`/(app)/(job)/details/${data.jobId}`);
        }
        break;
      case "save_job":
        // Handle save job action without opening app
        this.saveJobFromNotification(data?.jobId);
        break;
      case "view_application":
        router.push("/(app)/(main)/applied-jobs");
        break;
      case "open_app":
        router.push("/(app)/(main)/main");
        break;
      default:
        console.log("Unknown action identifier:", actionIdentifier);
    }
  }

  /**
   * Save job from notification action (background action)
   */
  private async saveJobFromNotification(jobId: string) {
    try {
      if (jobId) {
        // Make API call to save job
        await axiosInstance.post(`/jobs/${jobId}/save`);
        console.log("Job saved from notification");
      }
    } catch (error) {
      console.error("Error saving job from notification:", error);
    }
  }

  /**
   * Set app badge count (iOS)
   */
  async setBadgeCount(count: number): Promise<void> {
    if (Platform.OS === "ios") {
      try {
        await Notifications.setBadgeCountAsync(count);
      } catch (error) {
        console.error("Error setting badge count:", error);
      }
    }
  }

  /**
   * Get app badge count (iOS)
   */
  async getBadgeCount(): Promise<number> {
    if (Platform.OS === "ios") {
      try {
        return await Notifications.getBadgeCountAsync();
      } catch (error) {
        console.error("Error getting badge count:", error);
        return 0;
      }
    }
    return 0;
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data: any = {},
    trigger: Notifications.NotificationTriggerInput | null = null
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: Platform.OS === "ios" ? "default" : undefined,
          badge: Platform.OS === "ios" ? 1 : undefined,
          categoryIdentifier: data.type || "default",
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling local notification:", error);
      return null;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  }

  /**
   * Get current push token
   */
  getCurrentToken(): string | null {
    return this.pushToken;
  }

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      await this.configureNotificationChannels();
      await this.getExpoPushToken();
      this.setupNotificationListeners();
      console.log("NotificationService initialized successfully");
    } catch (error) {
      console.error("Error initializing NotificationService:", error);
    }
  }
}

export default new NotificationService();
