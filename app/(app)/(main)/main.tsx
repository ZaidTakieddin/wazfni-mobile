import CategoryItem from "@/components/categories/CategoryItem";
import JobCard from "@/components/jobs/JobCard";
import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetMe from "@/hooks/auth/use-get-me";
import useGetCategories from "@/hooks/categories/use-get-categories";
import { useGetJobs } from "@/hooks/jobs/use-get-jobs";
import { useGetRecommendedJobs } from "@/hooks/jobs/use-get-recommended-jobs";
import { useGetViewedJobs } from "@/hooks/jobs/use-get-viewed-jobs";
import { Job } from "@/types/jobs";
import { isRTL } from "@/utils/rtl";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Main() {
  useGetMe();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { allData: categories, isLoading: categoriesLoading } = useGetCategories();
  const {
    allData: jobs,
    isLoading: jobsLoading,
    hasNextPage,
    isLoadingNextPage,
    loadNextPage,
    refetch,
    isRefetching,
  } = useGetJobs();
  const { allData: viewedJobs } = useGetViewedJobs({ limit: 5 }); // Limit to 5 items
  const { allData: recommendedJobs, isLoading: recommendedLoading } = useGetRecommendedJobs();

  const displayJobs = recommendedJobs && recommendedJobs.length > 0 ? recommendedJobs : jobs;
  const isLoading = recommendedLoading || jobsLoading || categoriesLoading;

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

  const renderJobEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="briefcase-outline" size={64} color={Colors.text.secondary} />
      </View>
      <Text style={styles.emptyTitle}>لا توجد وظائف متاحة حالياً</Text>
      <Text style={styles.emptySubtitle}>تحقق مرة أخرى لاحقاً للحصول على آخر الوظائف المتاحة</Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => router.push("/(app)/(search)/search")}
      >
        <Text style={styles.refreshButtonText}>ابحث عن وظائف</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>جارٍ تحميل الوظائف...</Text>
    </View>
  );

  const renderJobItem = ({ item }: { item: Job }) => {
    return (
      <View style={styles.fullWidthJobCard}>
        <JobCard job={item} style={styles.fullWidth} />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.content}>
      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          style={{
            direction: "rtl",
          }}
        >
          {categories?.map((item) => <CategoryItem key={item.id} category={item} />)}
        </ScrollView>
      </View>

      {/* Recent Views */}
      {viewedJobs && viewedJobs.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>مشاهداتي السابقة</Text>
            <TouchableOpacity onPress={() => router.push("/(app)/(main)/viewed-jobs")}>
              <Text style={styles.seeAllButton}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            horizontal
          >
            {viewedJobs?.map((item) => (
              <JobCard key={item.id} job={item.job} style={{ marginHorizontal: 6 }} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* My Jobs Section Header */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>وظائفي</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/(main)/all-jobs")}>
            <Text style={styles.seeAllButton}>عرض الكل</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar style={Platform.OS == "ios" ? "light" : "light"} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity>
              <Feather name="more-vertical" size={24} color="white" />
            </TouchableOpacity>
            <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
            <TouchableOpacity onPress={() => router.push("/(app)/(others)/notifications")}>
              <SvgIcon name="bell-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <Link href="/(app)/(search)/results">
            <View style={styles.searchContainer}>
              <SvgIcon
                name="search"
                size={24}
                color={Colors.text.secondary}
                style={{ marginStart: 8 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="بحث"
                placeholderTextColor={Colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                editable={false}
              />
            </View>
          </Link>
        </View>

        {/* Single FlatList for the entire content with infinite scroll */}
        <FlatList
          data={displayJobs || []}
          keyExtractor={(item) => item.id}
          renderItem={renderJobItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={isLoading ? renderJobLoadingState : renderJobEmptyState}
          ListFooterComponent={renderFooter}
          contentContainerStyle={[
            styles.jobsList,
            (!displayJobs || displayJobs.length === 0) && !isLoading && styles.emptyJobsList,
          ]}
          style={{ backgroundColor: Colors.background.light, flex: 1 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS == "ios" ? 48 : 48,
  },
  header: {
    backgroundColor: Colors.primary,
    margin: 16,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: -32,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    textAlign: "right",
    fontFamily: "RZ-Reg",
    fontSize: 14,
    color: Colors.text.primary,
    height: Platform.OS == "ios" ? 44 : "auto",
  },
  content: {
    backgroundColor: Colors.background.light,
  },
  categoriesSection: {
    paddingVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
  },
  seeAllButton: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
  },
  jobsList: {
    backgroundColor: Colors.background.light,
  },
  emptyJobsList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  fullWidthJobCard: {
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 16,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
    minHeight: 300,
  },
  emptyIconContainer: {
    backgroundColor: Colors.background.light,
    borderRadius: 40,
    padding: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  refreshButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    minHeight: 300,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginTop: 16,
    textAlign: "center",
  },
});
