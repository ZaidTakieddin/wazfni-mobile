import JobCard from "@/components/jobs/JobCard";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetBookmarkedJobs from "@/hooks/jobs/use-get-bookmarked-jobs";
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

export default function Bookmarks() {
  const {
    allData: bookmarkedJobs,
    isRefetching,
    refetch,
    isLoading,
    hasNextPage,
    isLoadingNextPage,
    loadNextPage,
  } = useGetBookmarkedJobs();

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
          <Text style={styles.headerTitle}>المحفوظات</Text>
        </View>

        <FlatList
          data={bookmarkedJobs}
          renderItem={({ item }) => (
            <View style={styles.fullWidthJobCard}>
              <JobCard job={item} style={styles.fullWidth} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            bookmarkedJobs?.length === 0 ? styles.emptyContentContainer : styles.bookmarksList
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
                <Text style={styles.emptyTitle}>جاري تحميل المحفوظات</Text>
                <Text style={styles.emptySubtitle}>يرجى الانتظار بينما نحضر وظائفك المحفوظة</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <SvgIcon name="bookmark-linear" size={64} color={Colors.text.secondary} />
                </View>
                <Text style={styles.emptyTitle}>لا توجد وظائف محفوظة</Text>
                <Text style={styles.emptySubtitle}>ابدأ بحفظ الوظائف التي تهمك لتظهر هنا</Text>
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
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
  },
  bookmarksList: {
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
