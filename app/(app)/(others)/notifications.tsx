import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { isRTL } from "@/utils/rtl";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const notifications = [
  {
    id: "1",
    company: "تويتر",
    logo: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg",
    title: "مصمم واجهات المستخدم",
    description: "تحقق من هذه الوظيفة و9 توصيات وظيفية أخرى",
    timeAgo: "6 ساعات",
  },
  {
    id: "2",
    company: "تويتر",
    logo: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg",
    title: "مصمم واجهات المستخدم",
    description: "تحقق من هذه الوظيفة و9 توصيات وظيفية أخرى",
    timeAgo: "6 ساعات",
  },
  {
    id: "3",
    company: "تويتر",
    logo: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg",
    title: "مصمم واجهات المستخدم",
    description: "تحقق من هذه الوظيفة و9 توصيات وظيفية أخرى",
    timeAgo: "6 ساعات",
  },
  {
    id: "4",
    company: "تويتر",
    logo: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg",
    title: "مصمم واجهات المستخدم",
    description: "تحقق من هذه الوظيفة و9 توصيات وظيفية أخرى",
    timeAgo: "6 ساعات",
  },
];

export default function Notifications() {
  const renderNotificationItem = ({ item }: { item: (typeof notifications)[0] }) => (
    <View style={styles.notificationCard}>
      <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-vertical" size={20} color="#8DA0BC" />
      </TouchableOpacity>

      <View style={styles.notificationContent}>
        <Image source={{ uri: item.logo }} style={styles.companyLogo} />
        <View style={styles.textContainer}>
          <Text style={styles.companyText}>
            <Text style={styles.companyName}>{item.company}</Text>
            <Text style={{}}> يبحث عن </Text>
            <Text style={styles.jobTitle}>{item.title}</Text>
          </Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.actionContainer}>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
            <TouchableOpacity style={styles.seeJobButton}>
              <Text style={styles.seeJobText}>عرض الوظيفة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <Link
          href=".."
          style={{
            position: "absolute",
            right: isRTL() ? "auto" : 16,
            left: isRTL() ? 16 : "auto",
            bottom: 16,
          }}
        >
          <SvgIcon name="arrow-right" size={24} color="#062C65" />
        </Link>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 48,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  notificationsList: {
    padding: 16,
    gap: 16,
  },
  notificationCard: {
    backgroundColor: Colors.background.light,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  moreButton: {
    position: "absolute",
    top: 16,
    left: I18nManager.isRTL ? undefined : 16,
    right: I18nManager.isRTL ? 16 : undefined,
    zIndex: 1,
  },
  notificationContent: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    gap: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    flex: 0.9,
    gap: 8,
  },
  companyText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    lineHeight: 20,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  companyName: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  jobTitle: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  description: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  actionContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeAgo: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  seeJobButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  seeJobText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
});
