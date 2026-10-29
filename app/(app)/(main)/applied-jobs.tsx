import JobCard from "@/components/jobs/JobCard";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetMyApplications from "@/hooks/jobs/use-get-my-applications";
import { StatusBar } from "expo-status-bar";
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

export default function AppliedJobs() {
  const {
    allData: applications,
    isRefetching,
    refetch,
    isLoading,
    hasNextPage,
    isLoadingNextPage,
    loadNextPage,
  } = useGetMyApplications();

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
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>وظائفي المتقدم إليها</Text>
        </View>

        <FlatList
          data={applications}
          renderItem={({ item }) => (
            <View style={styles.fullWidthJobCard}>
              <JobCard job={item.job} style={styles.fullWidth} renderBoomarkIcon={false} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            applications?.length === 0 ? styles.emptyContentContainer : styles.bookmarksList
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
                <Text style={styles.emptyTitle}>جاري تحميل التطبيقات</Text>
                <Text style={styles.emptySubtitle}>
                  يرجى الانتظار بينما نحضر وظائفك المتقدم إليها
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <SvgIcon name="job-search" size={64} color={Colors.text.secondary} />
                </View>
                <Text style={styles.emptyTitle}>لم تتقدم لأي وظيفة بعد</Text>
                <Text style={styles.emptySubtitle}>
                  ابدأ بالبحث عن وظائف والتقدم إليها لتظهر هنا
                </Text>
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
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginLeft: 8,
  },
});
