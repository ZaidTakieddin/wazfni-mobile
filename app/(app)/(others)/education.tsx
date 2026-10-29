import DeleteConfirmationSheet from "@/components/DeleteConfirmationSheet";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useDeleteEducationCertificate from "@/hooks/education-certificates/use-delete-education-certificate";
import useGetMyEducationCertificates from "@/hooks/education-certificates/use-get-my-education-certificates";
import { EducationCertificate } from "@/types/education-certificates";
import { degrees } from "@/types/enums";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
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

export default function Education() {
  const [isDeleteConfirmationSheetOpen, setIsDeleteConfirmationSheetOpen] = useState(false);

  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(null);

  const { mutate: deleteEducationCertificate, isPending: isDeletingEducationCertificate } =
    useDeleteEducationCertificate();

  const handleDeleteEducation = () => {
    if (selectedEducationId) {
      deleteEducationCertificate(selectedEducationId, {
        onSuccess: () => {
          setIsDeleteConfirmationSheetOpen(false);
        },
      });
    }
  };

  const handleOpenDeleteConfirmationSheet = (id: string) => {
    setSelectedEducationId(id);
    setIsDeleteConfirmationSheetOpen(true);
  };

  const {
    allData: educationData,
    isLoading: isLoadingEducationData,
    refetch: refetchEducationData,
    isRefetching: isRefetchingEducationData,
    loadNextPage,
    hasNextPage,
    isLoadingNextPage,
  } = useGetMyEducationCertificates();
  console.log("educationData", educationData);
  const EducationCard = ({ item }: { item: EducationCertificate }) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.universityName}>{item.university}</Text>
        <View style={styles.actionButtons}>
          <Link href={`/(app)/(others)/edit-education/${item.id}`}>
            <Image
              source={require("@/assets/images/edit-2.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </Link>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOpenDeleteConfirmationSheet(item.id)}
          >
            <Image
              source={require("@/assets/images/trash.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardContentParent}>
          <Text style={styles.degreeText}>
            {degrees.find((degree) => degree.value === item.degree)?.label}
          </Text>
          <Text style={styles.typeText}>{item.certificateName}</Text>
          <Text style={styles.periodText}>
            {formatDate(item.startDate, "MMMM YYYY")} -{" "}
            {item.endDate ? formatDate(item.endDate, "MMMM YYYY") : "الى الآن"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الخبرات التعليمية</Text>
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

      {/* Education List */}
      <View style={styles.content}>
        <FlashList
          data={educationData}
          renderItem={({ item }) =>
            isLoadingEducationData ? (
              <ActivityIndicator size="large" color="#004AAD" />
            ) : (
              <EducationCard item={item} />
            )
          }
          estimatedItemSize={100}
          refreshing={isRefetchingEducationData}
          onRefresh={refetchEducationData}
          showsVerticalScrollIndicator={false}
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

      {/* Add Button */}
      {!isDeleteConfirmationSheetOpen && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(app)/(others)/add-education")}
        >
          <Text style={styles.addButtonText}>إضافة خبرة تعليمية</Text>
        </TouchableOpacity>
      )}

      <DeleteConfirmationSheet
        visible={isDeleteConfirmationSheetOpen}
        onClose={() => setIsDeleteConfirmationSheetOpen(false)}
        onConfirm={handleDeleteEducation}
        isLoading={isDeletingEducationCertificate}
        title="حذف الخبرة التعليمية"
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
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
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
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  universityName: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  actionButtons: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    gap: 8,
  },
  actionButton: {},
  cardContent: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  cardContentParent: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    gap: 16,
  },
  degreeText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
  },
  typeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginTop: -8,
  },
  periodText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
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
    fontFamily: "RZ-Reg",
    textAlign: "center",
    width: "100%",
  },
});
