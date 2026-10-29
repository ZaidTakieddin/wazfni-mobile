import DeleteConfirmationSheet from "@/components/DeleteConfirmationSheet";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useDeleteWorkExperience from "@/hooks/work-experiences/use-delete-work-experience";
import useGetMyWorkExperiences from "@/hooks/work-experiences/use-get-my-work-experiences";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WorkExperience() {
  const router = useRouter();
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);

  const {
    allData: experiences,
    isLoading: isLoadingExperiences,
    refetch: refetchExperiences,
    isRefetching: isRefetchingExperiences,
    loadNextPage,
    hasNextPage,
    isLoadingNextPage,
  } = useGetMyWorkExperiences();

  const { mutate: deleteExperience, isPending: isDeleting } = useDeleteWorkExperience();

  const handleAddExperience = () => {
    router.push("/(app)/(others)/add-experience");
  };

  const handleCloseDeleteConfirmationSheet = () => {
    setIsDeleteConfirmationVisible(false);
    setSelectedExperienceId(null);
  };

  const handleDeleteExperience = (id: string | null) => {
    if (!id) return;
    deleteExperience(id, {
      onSuccess: () => {
        handleCloseDeleteConfirmationSheet();
      },
    });
  };

  const handleOpenDeleteConfirmationSheet = (id: string) => {
    setIsDeleteConfirmationVisible(true);
    setSelectedExperienceId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الخبرات العملية</Text>
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

      <View style={styles.content}>
        <FlashList
          data={experiences}
          renderItem={({ item }) =>
            isLoadingExperiences ? (
              <ActivityIndicator size="large" color="#000000" />
            ) : (
              <View key={item.id} style={styles.experienceCard}>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => handleOpenDeleteConfirmationSheet(item.id)}>
                    <Image
                      source={require("@/assets/images/trash.png")}
                      resizeMode="contain"
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>
                  <Link href={`/edit-experience/${item.id}`}>
                    <Image
                      source={require("@/assets/images/edit-2.png")}
                      resizeMode="contain"
                      style={{ width: 24, height: 24 }}
                    />
                  </Link>
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                  <Text style={styles.companyName}>{item.companyName}</Text>
                  <Text style={styles.dateRange}>
                    {formatDate(item.startDate, "MMMM YYYY")} -{" "}
                    {item.endDate ? formatDate(item.endDate, "MMMM YYYY") : "إلى الآن"}
                  </Text>
                </View>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
          refreshing={isRefetchingExperiences}
          onRefresh={refetchExperiences}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isLoadingNextPage ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#004AAD" />
                <Text style={{ color: Colors.text.secondary, marginTop: 8, fontFamily: "RZ-Reg" }}>
                  جاري تحميل المزيد...
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {!isDeleteConfirmationVisible && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddExperience}>
          <Text style={styles.addButtonText}>إضافة خبرة عملية</Text>
        </TouchableOpacity>
      )}

      <DeleteConfirmationSheet
        visible={isDeleteConfirmationVisible}
        onClose={() => setIsDeleteConfirmationVisible(false)}
        onConfirm={() => handleDeleteExperience(selectedExperienceId)}
        isLoading={isDeleting}
        title="حذف الخبرة العملية"
        buttonText="حذف"
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
    justifyContent: "center",
    gap: 24,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  experienceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  cardDetails: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    gap: 16,
  },
  cardActions: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    gap: 8,
  },
  jobTitle: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  companyName: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  dateRange: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  addButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "RZ-Bold",
    width: "100%",
    textAlign: "center",
  },
});
