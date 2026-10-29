import DeleteConfirmationSheet from "@/components/DeleteConfirmationSheet";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetMyCompany from "@/hooks/companies/use-get-my-company";
import useArchiveJob from "@/hooks/jobs/use-archive-job";
import useDeleteJob from "@/hooks/jobs/use-delete-job";
import useGetMyCompanyArchivedJobs from "@/hooks/jobs/use-get-my-company-archived-jobs";
import useGetMyCompanyJobs from "@/hooks/jobs/use-get-my-company-jobs";
import useUnarchiveJob from "@/hooks/jobs/use-unarchive-job";
import useGetUploads from "@/hooks/use-get-uploads";
import { Job } from "@/types/jobs";
import { formatDate } from "@/utils/date";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "current" | "archive";

const JobCard = ({
  job,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
}: {
  job: Job;
  onEdit: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
}) => {
  const { data: myCompany } = useGetMyCompany();
  const { data: companyLogo } = useGetUploads(myCompany?.logo || "");

  return (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobActions}>
          {onDelete && (
            <TouchableOpacity onPress={onDelete}>
              <Image
                source={require("@/assets/images/trash.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {onArchive && (
            <TouchableOpacity onPress={onArchive}>
              <SvgIcon name="archive-down-linear" size={20} color={Colors.grey} />
            </TouchableOpacity>
          )}
          {onUnarchive && (
            <TouchableOpacity onPress={onUnarchive}>
              <SvgIcon name="archive-up-linear" size={20} color={Colors.grey} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onEdit}>
            <Image
              source={require("@/assets/images/edit-2.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Image
            source={require("@/assets/images/profile-tick.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text style={styles.statLabel}>المتقدمين</Text>
          <Text style={styles.statValue}>{job._count?.applications}</Text>
        </View>
        <View style={styles.statItem}>
          <Image
            source={require("@/assets/images/eye.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text style={styles.statLabel}>المشاهدات</Text>
          <Text style={styles.statValue}>{job._count?.viewHistory}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.expiryDate}>{formatDate(job.createdAt, "DD  MMMM  YYYY")}</Text>
        <TouchableOpacity
          style={styles.viewApplicantsButton}
          onPress={() =>
            router.push({
              pathname: "/main/applicants/[jobId]",
              params: { jobId: job.id },
            })
          }
        >
          <Text style={styles.viewApplicantsText}>عرض المتقدمين</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function CompanyHome() {
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [archiveConfirmVisible, setArchiveConfirmVisible] = useState(false);
  const [unarchiveConfirmVisible, setUnarchiveConfirmVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const {
    allData: jobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    isRefetching: isRefetchingJobs,
    hasNextPage: hasNextPageJobs,
    isLoadingNextPage: isLoadingNextPageJobs,
    loadNextPage: loadNextPageJobs,
  } = useGetMyCompanyJobs();
  const { mutate: deleteJob, isPending: isDeletingJob } = useDeleteJob();
  const { mutate: archiveJob, isPending: isArchivingJob } = useArchiveJob();
  const { mutate: unarchiveJob, isPending: isUnarchivingJob } = useUnarchiveJob();
  const {
    allData: archivedJobs,
    isLoading: isLoadingArchivedJobs,
    refetch: refetchArchivedJobs,
    isRefetching: isRefetchingArchivedJobs,
    hasNextPage: hasNextPageArchived,
    isLoadingNextPage: isLoadingNextPageArchived,
    loadNextPage: loadNextPageArchived,
  } = useGetMyCompanyArchivedJobs();

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as TabType);
    }
  }, [tab]);

  const handleJobsEndReached = () => {
    if (hasNextPageJobs && !isLoadingNextPageJobs) {
      loadNextPageJobs();
    }
  };

  const handleArchivedEndReached = () => {
    if (hasNextPageArchived && !isLoadingNextPageArchived) {
      loadNextPageArchived();
    }
  };

  const renderJobsFooter = () => {
    if (!isLoadingNextPageJobs) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  const renderArchivedFooter = () => {
    if (!isLoadingNextPageArchived) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  const handleEdit = (jobId: string) => {
    router.push({
      pathname: "/edit-job/[jobId]",
      params: { jobId },
    });
  };

  const handleDeletePress = (jobId: string) => {
    setSelectedJobId(jobId);
    setDeleteConfirmVisible(true);
  };

  const handleArchivePress = (jobId: string) => {
    setSelectedJobId(jobId);
    setArchiveConfirmVisible(true);
  };

  const handleUnarchivePress = (jobId: string) => {
    setSelectedJobId(jobId);
    setUnarchiveConfirmVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedJobId) {
      deleteJob(selectedJobId, {
        onSuccess: () => {
          setDeleteConfirmVisible(false);
          setSelectedJobId(null);
        },
      });
    }
  };

  const handleArchiveConfirm = () => {
    if (selectedJobId) {
      archiveJob(
        { jobId: selectedJobId },
        {
          onSuccess: () => {
            setArchiveConfirmVisible(false);
            setSelectedJobId(null);
          },
        }
      );
    }
  };

  const handleUnarchiveConfirm = () => {
    if (selectedJobId) {
      unarchiveJob(
        { jobId: selectedJobId },
        {
          onSuccess: () => {
            setUnarchiveConfirmVisible(false);
            setSelectedJobId(null);
          },
        }
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmVisible(false);
    setSelectedJobId(null);
  };

  const handleArchiveCancel = () => {
    setArchiveConfirmVisible(false);
    setSelectedJobId(null);
  };

  const handleUnarchiveCancel = () => {
    setUnarchiveConfirmVisible(false);
    setSelectedJobId(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        {/* <Image
          source={require("@/assets/images/background.png")}
          style={styles.headerPattern}
          resizeMode="cover"
        /> */}
        <TouchableOpacity
          style={{ flex: 1, alignItems: I18nManager.isRTL ? "flex-start" : "flex-end" }}
        >
          <SvgIcon name="bell-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
        <View style={{ flex: 1 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "archive" && styles.activeTab]}
          onPress={() => setActiveTab("archive")}
        >
          <Text style={[styles.tabText, activeTab === "archive" && styles.activeTabText]}>
            أرشيف الوظائف
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Text style={[styles.tabText, activeTab === "current" && styles.activeTabText]}>
            الوظائف الحالية
          </Text>
        </TouchableOpacity>
      </View>

      {/* Job Listings */}
      {activeTab === "current" && (
        <View style={styles.content}>
          <FlatList
            data={jobs}
            renderItem={({ item }) => (
              <JobCard
                job={item}
                onEdit={() => handleEdit(item.id)}
                onArchive={() => handleArchivePress(item.id)}
              />
            )}
            onRefresh={refetchJobs}
            refreshing={isRefetchingJobs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={jobs?.length === 0 ? styles.emptyContentContainer : undefined}
            ListEmptyComponent={
              isLoadingJobs ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <SvgIcon name="briefcase-linear" size={64} color={Colors.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>جاري تحميل الوظائف</Text>
                  <Text style={styles.emptySubtitle}>يرجى الانتظار بينما نحضر وظائفك</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <SvgIcon name="briefcase-linear" size={64} color={Colors.text.secondary} />
                  </View>
                  <Text style={styles.emptyTitle}>لا يوجد وظائف حالية</Text>
                  <Text style={styles.emptySubtitle}>
                    ابدأ بإنشاء وظيفة جديدة لجذب المواهب المناسبة
                  </Text>
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
            onEndReached={handleJobsEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderJobsFooter}
          />
        </View>
      )}

      {activeTab === "archive" && (
        <View style={styles.content}>
          <FlatList
            data={archivedJobs}
            renderItem={({ item }) => (
              <JobCard
                job={item}
                onEdit={() => handleEdit(item.id)}
                onUnarchive={() => handleUnarchivePress(item.id)}
                onDelete={() => handleDeletePress(item.id)}
              />
            )}
            onRefresh={refetchArchivedJobs}
            refreshing={isRefetchingArchivedJobs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={
              archivedJobs?.length === 0 ? styles.emptyContentContainer : undefined
            }
            ListEmptyComponent={
              isLoadingArchivedJobs ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <SvgIcon name="archive-down-linear" size={64} color={Colors.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>جاري تحميل الأرشيف</Text>
                  <Text style={styles.emptySubtitle}>يرجى الانتظار بينما نحضر وظائفك المؤرشفة</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <SvgIcon name="archive-down-linear" size={64} color={Colors.text.secondary} />
                  </View>
                  <Text style={styles.emptyTitle}>لا يوجد وظائف مؤرشفة</Text>
                  <Text style={styles.emptySubtitle}>الوظائف المؤرشفة ستظهر هنا عند أرشفتها</Text>
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
            onEndReached={handleArchivedEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderArchivedFooter}
          />
        </View>
      )}

      <DeleteConfirmationSheet
        visible={deleteConfirmVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeletingJob}
        title="هل أنت متأكد من حذف هذه الوظيفة؟"
        buttonText="حذف"
      />

      <DeleteConfirmationSheet
        visible={archiveConfirmVisible}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        isLoading={isArchivingJob}
        title="هل أنت متأكد من أرشفة هذه الوظيفة؟"
        buttonText="أرشفة"
      />

      <DeleteConfirmationSheet
        visible={unarchiveConfirmVisible}
        onClose={handleUnarchiveCancel}
        onConfirm={handleUnarchiveConfirm}
        isLoading={isUnarchivingJob}
        title="هل أنت متأكد من إلغاء أرشفة هذه الوظيفة؟"
        buttonText="إلغاء الأرشفة"
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
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingHorizontal: 16,
    height: 160,
  },
  // headerPattern: {
  //   position: "absolute",
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: Colors.primary,
  //   resizeMode: "cover",
  // },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  tabContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    padding: 16,
    gap: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  activeTabText: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  jobActions: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    gap: 8,
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
  jobTitle: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 4,
  },
  companyContainer: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  companyName: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  statsContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  statValue: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  statLabel: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: "RZ-Reg",
  },
  jobFooter: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 16,
  },
  expiryDate: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  viewApplicantsButton: {},
  viewApplicantsText: {
    fontSize: 10,
    color: Colors.primary,
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
  loadingFooter: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
});
