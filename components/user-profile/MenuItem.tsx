import React from "react";
import { I18nManager, TouchableOpacity } from "react-native";

import NotificationToggle from "@/components/notifications/NotificationToggle";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export interface MenuItem {
  id: string;
  title: string;
  route: LinkProps["href"];
  isSwitch?: boolean;
  color: string;
  icon: (color: string) => React.ReactNode;
  routerReplace?: boolean;
}

interface MenuItemProps {
  item: MenuItem;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
}

const MenuItem = ({ item, notificationsEnabled, setNotificationsEnabled }: MenuItemProps) => {
  // For switch items (notifications), don't wrap in Link
  if (item.isSwitch) {
    return (
      <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
        <View style={styles.menuItemLeft}>
          <NotificationToggle onToggle={setNotificationsEnabled} />
        </View>
        <View style={styles.menuItemRight}>
          <Text style={[styles.menuItemText, { color: item.color }]}>{item.title}</Text>
          {item.icon(item.color)}
        </View>
      </TouchableOpacity>
    );
  }

  // For regular menu items, wrap in Link
  return (
    <Link href={item.route as any} asChild key={item.id} replace={item.routerReplace}>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="chevron-back" size={20} color={item.color} />
        </View>
        <View style={styles.menuItemRight}>
          <Text style={[styles.menuItemText, { color: item.color }]}>{item.title}</Text>
          {item.icon(item.color)}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemRight: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
    lineHeight: 24,
  },
});
