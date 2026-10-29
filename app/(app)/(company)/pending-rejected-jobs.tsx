import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetMyCompany from "@/hooks/companies/use-get-my-company";
import useGetMyCompanyPendingJobs from "@/hooks/jobs/use-get-my-company-pending-jobs";
import useGetMyCompanyRejectedJobs from "@/hooks/jobs/use-get-my-company-rejected-jobs";
import useGetUploads from "@/hooks/use-get-uploads";
import { Job } from "@/types/jobs";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "pending" | "rejected";

const PendingJobCard = ({ job }: { job: Job }) => {
  const { data: myCompany } = useGetMyCompany();
  const { data: companyLogo } = useGetUploads(myCompany?.logo || "");

  return (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <View style={styles.companyLogoContainer}>
            <Image
              source={
                companyLogo ? { uri: companyLogo } : require("@/assets/images/wazfni-logo.png")
              }
              style={styles.companyLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.companyContainer}>
            <Text style={styles.jobTitle}>{job.jobTitle}</Text>
            <Text style={styles.companyName}>{myCompany?.name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.pendingStatusItem}>
          <SvgIcon name="clock-linear" size={20} color={Colors.white} />
          <Text style={styles.statusLabel}>في انتظار المراجعة</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.createdDate}>{formatDate(job.createdAt, "DD  MMMM  YYYY")}</Text>
      </View>
    </View>
  );
};

const RejectedJobCard = ({ job }: { job: Job }) => {
  const { data: myCompany } = useGetMyCompany();
  const { data: companyLogo } = useGetUploads(myCompany?.logo || "");

  return (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <View style={styles.companyLogoContainer}>
            <Image
              source={
                companyLogo ? { uri: companyLogo } : require("@/assets/images/wazfni-logo.png")
              }
              style={styles.companyLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.companyContainer}>
            <Text style={styles.jobTitle}>{job.jobTitle}</Text>
            <Text style={styles.companyName}>{myCompany?.name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.rejectedStatusItem}>
          <SvgIcon name="close-circle" size={20} color={Colors.danger} />
          <Text style={styles.rejectedStatusLabel}>مرفوضة</Text>
        </View>
      </View>

      {job.rejectionReason && (
        <View style={styles.rejectionContainer}>
          <Text style={styles.rejectionTitle}>سبب الرفض:</Text>
          <Text style={styles.rejectionReason}>{job.rejectionReason}</Text>
        </View>
      )}

      <View style={styles.jobFooter}>
        <Text style={styles.createdDate}>{formatDate(job.createdAt, "DD  MMMM  YYYY")}</Text>
      </View>
    </View>
  );
};

export default function PendingRejectedJobs() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const {
    allData: pendingJobs,
    isLoading: isLoadingPending,
    refetch: refetchPending,
    isRefetching: isRefetchingPending,
    hasNextPage: hasNextPagePending,
    isLoadingNextPage: isLoadingNextPagePending,
    loadNextPage: loadNextPagePending,
  } = useGetMyCompanyPendingJobs();

  const {
    allData: rejectedJobs,
    isLoading: isLoadingRejected,
    refetch: refetchRejected,
    isRefetching: isRefetchingRejected,
    hasNextPage: hasNextPageRejected,
    isLoadingNextPage: isLoadingNextPageRejected,
    loadNextPage: loadNextPageRejected,
  } = useGetMyCompanyRejectedJobs();

  const currentJobs = activeTab === "pending" ? pendingJobs : rejectedJobs;
  const isLoading = activeTab === "pending" ? isLoadingPending : isLoadingRejected;
  const isRefreshing = activeTab === "pending" ? isRefetchingPending : isRefetchingRejected;
  const refetch = activeTab === "pending" ? refetchPending : refetchRejected;
  const hasNextPage = activeTab === "pending" ? hasNextPagePending : hasNextPageRejected;
  const isLoadingNextPage =
    activeTab === "pending" ? isLoadingNextPagePending : isLoadingNextPageRejected;
  const loadNextPage = activeTab === "pending" ? loadNextPagePending : loadNextPageRejected;

  const handleEndReached = () => {
    if (hasNextPage && !isLoadingNextPage) {
      loadNextPage();
    }
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingFooterText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
    >
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <SvgIcon
            name={activeTab === "pending" ? "clock-linear" : "close-oultine"}
            size={64}
            color={activeTab === "pending" ? Colors.warning : Colors.danger}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {activeTab === "pending" ? "لا توجد وظائف معلقة" : "لا توجد وظائف مرفوضة"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {activeTab === "pending"
            ? "جميع وظائفك المنشورة تمت الموافقة عليها أو المراجعة"
            : "لم يتم رفض أي من وظائفك المنشورة"}
        </Text>
        <View style={styles.emptyActionContainer}>
          <Text style={styles.emptyActionText}>
            {activeTab === "pending"
              ? "يمكنك متابعة حالة الوظائف الجديدة هنا"
              : "يمكنك مراجعة أسباب الرفض والتعديل عليها"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderJobItem = ({ item }: { item: Job }) =>
    activeTab === "pending" ? <PendingJobCard job={item} /> : <RejectedJobCard job={item} />;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      );
    }

    if (!currentJobs || currentJobs.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={currentJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الوظائف المعلقة والمرفوضة</Text>
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={[styles.tabText, activeTab === "pending" && styles.activeTabText]}>
            معلقة {pendingJobs?.length ? `(${pendingJobs.length})` : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "rejected" && styles.activeTab]}
          onPress={() => setActiveTab("rejected")}
        >
          <Text style={[styles.tabText, activeTab === "rejected" && styles.activeTabText]}>
            مرفوضة {rejectedJobs?.length ? `(${rejectedJobs.length})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  activeTabText: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  jobHeader: {
    marginBottom: 16,
  },
  jobTitleContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  companyLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: "hidden",
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  companyContainer: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  jobTitle: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  statusContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    gap: 16,
    marginBottom: 16,
  },
  pendingStatusItem: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.warning,
    borderRadius: 8,
    padding: 12,
  },
  rejectedStatusItem: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    padding: 12,
  },
  statusLabel: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: "RZ-Reg",
  },
  rejectedStatusLabel: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  jobFooter: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 16,
  },
  createdDate: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  rejectionContainer: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
  },
  rejectionTitle: {
    fontSize: 12,
    color: Colors.danger,
    fontFamily: "RZ-Bold",
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 12,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
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
    fontSize: 18,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginTop: 24,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyActionContainer: {
    marginTop: 16,
  },
  emptyActionText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
  },
  loadingFooter: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingFooterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
});
