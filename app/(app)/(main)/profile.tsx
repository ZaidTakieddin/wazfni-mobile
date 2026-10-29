import AvatarUploadModal from "@/components/AvatarUploadModal";
import ErrorDebugPanel from "@/components/ErrorDebugPanel";
import NotificationTestButton from "@/components/notifications/NotificationTestButton";
import SvgIcon from "@/components/SvgIcon";
import MenuItem, { type MenuItem as MenuItemType } from "@/components/user-profile/MenuItem";
import { Colors } from "@/constants/Colors";
import useGetMe from "@/hooks/auth/use-get-me";
import useLogout from "@/hooks/auth/use-logout";
import useUpdateMe from "@/hooks/auth/use-update-me";
import useGetMyCompany from "@/hooks/companies/use-get-my-company";
import useGetUploads from "@/hooks/use-get-uploads";
import { CompanyApprovalStatus } from "@/types/companies";
import { LinkProps } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

const menuItems: MenuItemType[] = [
  {
    id: "2",
    title: "المعلومات الشخصية",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/personal-info.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(others)/personal-info",
    color: Colors.text.secondary,
  },
  {
    id: "3",
    title: "التعليم",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/education.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(others)/education",
    color: Colors.text.secondary,
  },
  {
    id: "4",
    title: "الخبرات",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/medal-star.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(others)/work-experience",
    color: Colors.text.secondary,
  },
  {
    id: "5",
    title: "المحفوظات",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/bookmarks.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/bookmarks",
    color: Colors.text.secondary,
  },
  {
    id: "6",
    title: "تغيير كلمة المرور",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/key.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(others)/change-password",
    color: Colors.text.secondary,
  },
  {
    id: "7",
    title: "الإشعارات",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/notification.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/notifications",
    isSwitch: true,
    color: Colors.text.secondary,
  },
  // {
  //   id: "8",
  //   title: "اللغة",
  //   icon: (color: string) => (
  //     <Image
  //       source={require("@/assets/images/translate.png")}
  //       style={{ width: 24, height: 24, tintColor: color }}
  //       resizeMode="contain"
  //     />
  //   ),
  //   route: "/+not-found",
  //   color: Colors.text.secondary,
  // },
  {
    id: "9",
    title: "سياسة الخصوصية",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/shield.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(others)/privacy-policy",
    color: Colors.text.secondary,
  },
];

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = React.useState(false);

  const { data: me } = useGetMe();
  const { data: company } = useGetMyCompany();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: updateMe, isPending: isUpdatingMe } = useUpdateMe();
  const { data: avatarUri, isLoading: isAvatarLoading } = useGetUploads(me?.avatar ?? "");

  const isImageLoading = isAvatarLoading || isUpdatingMe;

  const handleAvatarUpload = (formData: FormData) => {
    updateMe(formData);
  };

  const getCompanyMenuContent = () => {
    if (!company) {
      // No company exists - show create company option
      return {
        title: "إنشاء شركة",
        route: "/(app)/(others)/edit-company" as LinkProps["href"],
        color: Colors.primary,
        routerReplace: false,
      };
    }

    // Check company approval status
    switch (company.approvalStatus) {
      case CompanyApprovalStatus.PENDING:
        return {
          title: "شركتي (قيد المراجعة)",
          route: "/(app)/(others)/edit-company" as LinkProps["href"],
          color: Colors.warning,
          routerReplace: false,
        };
      case CompanyApprovalStatus.REJECTED:
        return {
          title: "شركتي (مرفوضة)",
          route: "/(app)/(others)/edit-company" as LinkProps["href"],
          color: Colors.danger,
          routerReplace: false,
        };
      case CompanyApprovalStatus.APPROVED:
      default:
        // Approved or legacy companies (no status field)
        return {
          title: "شركتي",
          route: "/(app)/(company)/company-profile" as LinkProps["href"],
          color: Colors.primary,
          routerReplace: true,
        };
    }
  };

  const extendedMenuItems = useMemo(() => {
    const companyMenuContent = getCompanyMenuContent();

    return [
      {
        id: "1",
        title: companyMenuContent.title,
        icon: (color: string) => (
          <Image
            source={require("@/assets/images/company.png")}
            style={{ width: 24, height: 24, tintColor: color }}
            resizeMode="contain"
          />
        ),
        route: companyMenuContent.route,
        color: companyMenuContent.color,
        routerReplace: companyMenuContent.routerReplace,
      },
      ...menuItems,
    ];
  }, [company]);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {isImageLoading ? (
            <Skeleton
              isLoading={isImageLoading}
              layout={[{ key: "someId", width: 100, height: 100, borderRadius: 100 }]}
              containerStyle={styles.profileImage}
            />
          ) : (
            <Image
              source={
                me?.avatar
                  ? { uri: avatarUri }
                  : require("@/assets/images/avatar-placeholder-2.webp")
              }
              style={styles.profileImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={() => setIsAvatarModalVisible(true)}
          >
            <SvgIcon name="pen-linear" size={10} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.profileName}>
            {me?.firstName} {me?.lastName}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={{ flex: 1, backgroundColor: Colors.background.light }}>
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {/* Company Status Banner */}
          {company && company.approvalStatus === CompanyApprovalStatus.PENDING && (
            <View style={styles.statusBanner}>
              <SvgIcon name="clock-animated" size={20} color={Colors.warning} />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>طلب الشركة قيد المراجعة</Text>
                <Text style={styles.statusSubtitle}>
                  سيتم إشعارك عند الموافقة على طلب إنشاء الشركة
                </Text>
              </View>
            </View>
          )}

          {company && company.approvalStatus === CompanyApprovalStatus.REJECTED && (
            <View style={[styles.statusBanner, styles.rejectedBanner]}>
              <SvgIcon name="close-circle" size={20} color={Colors.danger} />
              <View style={styles.statusTextContainer}>
                <Text style={[styles.statusTitle, styles.rejectedTitle]}>تم رفض طلب الشركة</Text>
                <Text style={styles.statusSubtitle}>
                  {company.rejectionReason || "يمكنك إعادة تعديل البيانات والتقديم مرة أخرى"}
                </Text>
              </View>
            </View>
          )}

          {extendedMenuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
            />
          ))}

          {/* Development: Test Section */}
          {__DEV__ && (
            <View style={styles.testSection}>
              <Text style={styles.testSectionTitle}>أدوات التطوير</Text>
              <NotificationTestButton style={styles.testButton} />
            </View>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#DC3545" />
            ) : (
              <>
                <Text style={styles.logoutText}>تسجيل خروج</Text>
                <Image
                  source={require("@/assets/images/logout.png")}
                  style={{ width: 24, height: 24, tintColor: Colors.danger }}
                  resizeMode="contain"
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Error Debug Panel - Only in development */}
        {__DEV__ && <ErrorDebugPanel />}
      </View>

      <AvatarUploadModal
        visible={isAvatarModalVisible}
        onClose={() => setIsAvatarModalVisible(false)}
        onUpload={handleAvatarUpload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS == "ios" ? 24 : 48,
  },
  header: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  profileImageContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: -75,
    zIndex: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.white,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 44,
    right: I18nManager.isRTL ? undefined : 22,
    left: I18nManager.isRTL ? 22 : undefined,
    borderRadius: 12,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "RZ-Bold",
    color: Colors.text.primary,
    marginTop: 12,
    textAlign: "center",
    width: "100%",
  },
  menuContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 100,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3CD",
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  rejectedBanner: {
    backgroundColor: "#FEF2F2",
    borderLeftColor: Colors.danger,
  },
  statusTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 14,
    color: Colors.warning,
    fontFamily: "RZ-Bold",
    marginBottom: 4,
  },
  rejectedTitle: {
    color: Colors.danger,
  },
  statusSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    lineHeight: 16,
  },
  logoutButton: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.danger,
    fontFamily: "RZ-Reg",
    lineHeight: 24,
  },
  testSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  testSectionTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  testButton: {
    marginTop: 0,
  },
});
