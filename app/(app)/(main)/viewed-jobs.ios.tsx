import JobCardIos from "@/components/jobs/JobCardIos";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { useGetViewedJobs } from "@/hooks/jobs/use-get-viewed-jobs";
import { isRTL } from "@/utils/rtl";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ViewedJobs() {
  const {
    allData: viewedJobs,
    isRefetching,
    refetch,
    isLoading,
    hasNextPage,
    isLoadingNextPage,
    loadNextPage,
  } = useGetViewedJobs();

  const handleEndReached = () => {
    if (hasNextPage && !isLoadingNextPage) {
      loadNextPage();
    }
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>مشاهداتي السابقة</Text>
          <Link
            href="../"
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

        <FlatList
          data={viewedJobs}
          renderItem={({ item }) => (
            <View style={styles.fullWidthJobCard}>
              <JobCardIos job={item.job} style={styles.fullWidth} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            viewedJobs?.length === 0 ? styles.emptyContentContainer : styles.jobsList
          }
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
                <Text style={styles.emptyTitle}>جاري تحميل مشاهداتك السابقة</Text>
                <Text style={styles.emptySubtitle}>
                  يرجى الانتظار بينما نحضر الوظائف التي شاهدتها
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <SvgIcon name="eye-linear" size={64} color={Colors.text.secondary} />
                </View>
                <Text style={styles.emptyTitle}>لا توجد مشاهدات سابقة</Text>
                <Text style={styles.emptySubtitle}>ابدأ بتصفح الوظائف لتظهر مشاهداتك هنا</Text>
              </View>
            )
          }
        />
      </SafeAreaView>
    </>
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
    paddingBottom: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
    position: "relative",
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  jobsList: {
    padding: 16,
  },
  fullWidthJobCard: {
    width: "100%",
    marginBottom: 16,
  },
  fullWidth: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    lineHeight: 20,
  },
});
