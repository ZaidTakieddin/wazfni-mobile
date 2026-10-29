import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetSubcategories from "@/hooks/categories/use-get-subcategories";
import { isRTL } from "@/utils/rtl";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Subcategories() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();
  const router = useRouter();

  const {
    allData: subcategories,
    isLoading,
    error,
    loadNextPage,
    hasNextPage,
    isLoadingNextPage,
    refetch,
    isRefetching,
  } = useGetSubcategories(categoryId || "");

  const handleSubcategoryPress = (subcategoryId: string, subcategoryName: string) => {
    // Navigate to search results with subcategory filter applied
    router.push({
      pathname: "/(app)/(search)/results",
      params: {
        subcategoryId,
        subcategoryName,
        categoryId,
        categoryName,
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>حدث خطأ في تحميل التصنيفات الفرعية</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>العودة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderSubcategoryItem = ({ item: subcategory }: { item: any }) => (
    <TouchableOpacity
      key={subcategory.id}
      style={styles.subcategoryItem}
      onPress={() => handleSubcategoryPress(subcategory.id, subcategory.name)}
    >
      <View style={styles.subcategoryContent}>
        <Text style={styles.subcategoryName}>{subcategory.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              right: isRTL() ? "auto" : 16,
              left: isRTL() ? 16 : "auto",
            },
          ]}
        >
          <SvgIcon name="arrow-right" size={24} color="#062C65" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || "التصنيفات الفرعية"}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {subcategories && subcategories.length > 0 ? (
          <FlashList
            data={subcategories}
            renderItem={renderSubcategoryItem}
            estimatedItemSize={80}
            contentContainerStyle={styles.scrollContainer}
            refreshing={isRefetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator={false}
            onEndReached={loadNextPage}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isLoadingNextPage ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text
                    style={{ color: Colors.text.secondary, marginTop: 8, fontFamily: "RZ-Reg" }}
                  >
                    جاري تحميل المزيد...
                  </Text>
                </View>
              ) : null
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد تصنيفات فرعية متاحة</Text>
          </View>
        )}
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    bottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "RZ-Reg",
    color: Colors.text.primary,
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  scrollContainer: {
    padding: 16,
  },
  subcategoryItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 12,
  },
  subcategoryContent: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subcategoryName: {
    fontSize: 16,
    fontFamily: "RZ-Reg",
    color: Colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "RZ-Reg",
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "RZ-Reg",
    color: Colors.text.primary,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "RZ-Reg",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "RZ-Reg",
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
