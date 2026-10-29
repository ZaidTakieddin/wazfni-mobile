import AvatarUploadModal from "@/components/AvatarUploadModal";
import SvgIcon from "@/components/SvgIcon";
import MenuItem, { type MenuItem as MenuItemType } from "@/components/user-profile/MenuItem";
import { Colors } from "@/constants/Colors";
import useLogout from "@/hooks/auth/use-logout";
import useGetMyCompany from "@/hooks/companies/use-get-my-company";
import useUpdateMyCompany from "@/hooks/companies/use-update-my-company";
import useGetUploads from "@/hooks/use-get-uploads";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

// Menu items data
const menuItems: MenuItemType[] = [
  {
    id: "1",
    title: "حسابي الشخصي",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/profile-outline.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(main)/profile",
    color: Colors.primary,
    routerReplace: true,
  },
  {
    id: "2",
    title: "تعديل معلومات شركتي",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/personal-info.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(others)/edit-company",
    color: Colors.text.secondary,
  },
  {
    id: "3",
    title: "الوظائف المعلقة والمرفوضة",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/clock.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(company)/pending-rejected-jobs",
    color: Colors.text.secondary,
  },
  {
    id: "4",
    title: "أرشيف الوظائف",
    icon: (color: string) => (
      <Image
        source={require("@/assets/images/archive-minus.png")}
        style={{ width: 24, height: 24, tintColor: color }}
        resizeMode="contain"
      />
    ),
    route: "/(app)/(company)/main?tab=archive",
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
];

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [isLogoModalVisible, setIsLogoModalVisible] = React.useState(false);

  const { mutate: updateCompany, isPending: isUpdatingCompany } = useUpdateMyCompany();

  const { data: myCompany } = useGetMyCompany();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: logoUri, isLoading: isLogoLoading } = useGetUploads(myCompany?.logo ?? "");

  const isImageLoading = isLogoLoading || isUpdatingCompany;

  const handleLogoUpload = (formData: FormData) => {
    // Change the form field name from "avatar" to "logo" for company uploads
    const logoFormData = new FormData();
    const avatarData = formData.get("avatar");
    if (avatarData) {
      logoFormData.append("logo", avatarData);
    }

    updateCompany(logoFormData);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
              source={logoUri ? { uri: logoUri } : require("@/assets/images/wazfni-logo.png")}
              style={styles.profileImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={() => setIsLogoModalVisible(true)}
          >
            <SvgIcon name="pen-linear" size={10} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.profileName}>{myCompany?.name}</Text>
        </View>
      </View>

      <View style={styles.profileInfoContainer}>
        {myCompany?.city && myCompany?.location && (
          <View style={styles.profileLocationContainer}>
            <Text style={styles.profileLocation}>
              {myCompany?.city}, {myCompany?.location}
            </Text>
            <SvgIcon name="pin-filled" size={15} color={Colors.primary} />
          </View>
        )}
        <Text style={styles.profileDescription}>{myCompany?.description}</Text>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
        ))}

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

      <AvatarUploadModal
        visible={isLogoModalVisible}
        onClose={() => setIsLogoModalVisible(false)}
        onUpload={handleLogoUpload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Colors.primary,
  },
  profileImageContainer: {
    alignItems: "center",
    bottom: -75,
    zIndex: 100,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.background.light,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 44,
    right: I18nManager.isRTL ? undefined : 12,
    left: I18nManager.isRTL ? 12 : undefined,
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
  profileLocation: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  profileDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
  },
  profileLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileInfoContainer: {
    paddingHorizontal: 16,
    marginTop: 84,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});
