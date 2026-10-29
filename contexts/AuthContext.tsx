import NotificationService from "@/services/notifications";
import { User } from "@/types/users";
import axiosInstance from "@/utils/axiosInstance";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  // Notification methods
  requestNotificationPermissions: () => Promise<boolean>;
  registerPushToken: () => Promise<boolean>;
  removePushToken: () => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      const storedUser = await SecureStore.getItemAsync("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

        // Initialize notifications for returning user
        if (Platform.OS !== "web") {
          await initializeNotifications();
        }
      }
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNotifications = async () => {
    try {
      // Configure notification channels (Android)
      await NotificationService.configureNotificationChannels();

      // Setup notification listeners
      NotificationService.setupNotificationListeners();

      // Try to register push token if permissions are already granted
      const permissions = await NotificationService.requestPermissions();
      if (permissions.granted) {
        await NotificationService.registerPushToken();
      }
    } catch (error) {
      console.error("Error initializing notifications:", error);
    }
  };

  const login = async (newToken: string, newUser: User) => {
    try {
      await SecureStore.setItemAsync("token", newToken);
      await SecureStore.setItemAsync("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      // Initialize notifications after successful login
      if (Platform.OS !== "web") {
        await initializeNotifications();
      }

      router.replace("/(app)/(main)/main");
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove push token from backend before logout
      if (Platform.OS !== "web") {
        await NotificationService.removePushToken();
      }

      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setToken(null);
      setUser(null);
      delete axiosInstance.defaults.headers.common.Authorization;
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
  };

  // Notification helper methods
  const requestNotificationPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "web") return false;

    try {
      const permissions = await NotificationService.requestPermissions();
      return permissions.granted;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  };

  const registerPushToken = async (): Promise<boolean> => {
    if (Platform.OS === "web" || !user) return false;

    try {
      return await NotificationService.registerPushToken();
    } catch (error) {
      console.error("Error registering push token:", error);
      return false;
    }
  };

  const removePushToken = async (): Promise<boolean> => {
    if (Platform.OS === "web") return false;

    try {
      return await NotificationService.removePushToken();
    } catch (error) {
      console.error("Error removing push token:", error);
      return false;
    }
  };

  const sendTestNotification = async (): Promise<boolean> => {
    if (Platform.OS === "web" || !user) return false;

    try {
      return await NotificationService.sendTestNotification();
    } catch (error) {
      console.error("Error sending test notification:", error);
      return false;
    }
  };

  // Set up axios interceptor for token expiration
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        requestNotificationPermissions,
        registerPushToken,
        removePushToken,
        sendTestNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
