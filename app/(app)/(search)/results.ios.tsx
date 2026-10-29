import JobCard from "@/components/jobs/JobCard";
import SearchEmptyState from "@/components/jobs/search-empty-state";
import { Colors } from "@/constants/Colors";
import useGetCategories from "@/hooks/categories/use-get-categories";
import { useGetSubcategoriesUnpaginated } from "@/hooks/categories/use-get-subcategories";
import { useGetSearchedJobs } from "@/hooks/jobs/use-get-searched-jobs";
import {
  cities,
  contractTypeOptions,
  experienceLevelOptions,
  workTypeOptions,
} from "@/types/enums";
import { JobFilters } from "@/types/jobs";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FilterBottomSheet, { FilterBottomSheetRef } from "./filter-bottom-sheet-ios";

export default function Results() {
  const { query, subcategoryId, categoryId, subcategoryName, categoryName } =
    useLocalSearchParams();

  // Separate state for search input (doesn't trigger API calls)
  const [searchText, setSearchText] = useState((query as string) || "");

  // Actual filters used for API calls - only updates when search is submitted
  const [filters, setFilters] = useState<Partial<JobFilters>>(() => {
    const initialFilters: Partial<JobFilters> = {
      searchTerm: (query as string) || "", // Use searchTerm for main search
      city: "",
      companyName: "",
      workType: [],
      contractType: [],
      experienceLevel: [],
      minSalary: "",
      maxSalary: "",
    };

    // Only add categoryId if it exists and is not empty
    if (categoryId && categoryId.toString().trim() !== "") {
      initialFilters.categoryId = categoryId as string;
    }

    // Only add subCategoryId if it exists and is not empty
    if (subcategoryId && subcategoryId.toString().trim() !== "") {
      initialFilters.subCategoryId = subcategoryId as string;
    }

    return initialFilters;
  });

  const {
    allData: jobs = [],
    isLoading,
    hasNextPage,
    isLoadingNextPage,
    loadNextPage,
    refetch,
    isRefetching,
  } = useGetSearchedJobs(filters);
  const { data: categories } = useGetCategories();
  const { data: subcategories } = useGetSubcategoriesUnpaginated((categoryId as string) || "");

  const filterBottomSheetRef = useRef<FilterBottomSheetRef>(null);

  // Update filters when navigation params change (e.g., from subcategories page)
  React.useEffect(() => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // Handle categoryId
      if (categoryId && categoryId.toString().trim() !== "") {
        newFilters.categoryId = categoryId as string;
      } else {
        delete newFilters.categoryId;
      }

      // Handle subCategoryId
      if (subcategoryId && subcategoryId.toString().trim() !== "") {
        newFilters.subCategoryId = subcategoryId as string;
      } else {
        delete newFilters.subCategoryId;
      }

      return newFilters;
    });
  }, [subcategoryId, categoryId]);

  const handleApplyFilters = (newFilters: Partial<JobFilters>) => {
    setFilters(newFilters);
    // Update search text to match the new filters
    setSearchText(newFilters.searchTerm || "");
  };

  const handleSearch = () => {
    // Only update filters when user submits search
    setFilters((prev) => ({
      ...prev,
      searchTerm: searchText, // Use searchTerm for main search
    }));
  };

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

  const hasActiveFilters = () => {
    return !!(
      filters.city ||
      filters.companyName ||
      filters.subCategoryId || // Updated to match API
      (filters.workType && filters.workType.length > 0) ||
      (filters.contractType && filters.contractType.length > 0) ||
      (filters.experienceLevel && filters.experienceLevel.length > 0) ||
      filters.minSalary ||
      filters.maxSalary
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.companyName) count++;
    if (filters.subCategoryId) count++; // Updated to match API
    if (filters.workType && filters.workType.length > 0) count += filters.workType.length;
    if (filters.contractType && filters.contractType.length > 0)
      count += filters.contractType.length;
    if (filters.experienceLevel && filters.experienceLevel.length > 0)
      count += filters.experienceLevel.length;
    if (filters.minSalary || filters.maxSalary) count++;
    return count;
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = { ...filters };

    if (filterKey === "city") {
      delete newFilters.city;
    } else if (filterKey === "companyName") {
      delete newFilters.companyName;
    } else if (filterKey === "subCategoryId") {
      // Updated to match API
      delete newFilters.subCategoryId;
    } else if (filterKey.startsWith("workType-")) {
      const value = filterKey.replace("workType-", "");
      newFilters.workType = newFilters.workType?.filter((type) => type !== value) || [];
    } else if (filterKey.startsWith("contractType-")) {
      const value = filterKey.replace("contractType-", "");
      newFilters.contractType = newFilters.contractType?.filter((type) => type !== value) || [];
    } else if (filterKey.startsWith("experienceLevel-")) {
      const value = filterKey.replace("experienceLevel-", "");
      newFilters.experienceLevel =
        newFilters.experienceLevel?.filter((level) => level !== value) || [];
    } else if (filterKey === "salary") {
      delete newFilters.minSalary;
      delete newFilters.maxSalary;
    }

    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters: Partial<JobFilters> = {
      searchTerm: searchText, // Keep current search text
      city: "",
      companyName: "",
      workType: [],
      contractType: [],
      experienceLevel: [],
      minSalary: "",
      maxSalary: "",
    };
    // Don't include categoryId or subCategoryId as empty strings
    setFilters(newFilters);
    // Reset the FilterBottomSheet's internal state
    filterBottomSheetRef.current?.reset();
  };

  const renderActiveFilter = (key: string, value: string) => (
    <View key={key} style={styles.activeFilter}>
      <TouchableOpacity onPress={() => removeFilter(key)} style={styles.removeFilterButton}>
        <Ionicons name="close" size={14} color={Colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.activeFilterText}>{value}</Text>
    </View>
  );

  const renderActiveFilters = () => {
    const activeFilters: React.ReactNode[] = [];

    if (filters.city) {
      const city = cities.find((c) => c.value === filters.city);
      activeFilters.push(renderActiveFilter("city", city?.label || filters.city));
    }

    if (filters.companyName) {
      activeFilters.push(renderActiveFilter("companyName", filters.companyName));
    }

    if (filters.subCategoryId && subcategories) {
      // Updated to match API
      const subcategory = subcategories.find((s: any) => s.id === filters.subCategoryId);
      activeFilters.push(renderActiveFilter("subCategoryId", subcategory?.name || ""));
    }

    if (filters.workType && filters.workType.length > 0) {
      filters.workType.forEach((type) => {
        const workType = workTypeOptions.find((w) => w.value === type);
        activeFilters.push(renderActiveFilter(`workType-${type}`, workType?.label || type));
      });
    }

    if (filters.contractType && filters.contractType.length > 0) {
      filters.contractType.forEach((type) => {
        const contractType = contractTypeOptions.find((c) => c.value === type);
        activeFilters.push(renderActiveFilter(`contractType-${type}`, contractType?.label || type));
      });
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filters.experienceLevel.forEach((level) => {
        const expLevel = experienceLevelOptions.find((e) => e.value === level);
        activeFilters.push(
          renderActiveFilter(`experienceLevel-${level}`, expLevel?.label || level)
        );
      });
    }

    if (filters.minSalary || filters.maxSalary) {
      const salaryText = `${filters.minSalary || "0"} - ${filters.maxSalary || "∞"}`;
      activeFilters.push(renderActiveFilter("salary", salaryText));
    }

    return activeFilters;
  };

  const renderEmptyState = () => (
    <SearchEmptyState searchTerm={filters.searchTerm} hasFilters={hasActiveFilters()} />
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>جارٍ البحث عن الوظائف...</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons
              name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن وظيفة..."
            placeholderTextColor={Colors.text.secondary}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            textAlign="right"
          />

          {searchText && searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => filterBottomSheetRef.current?.open()}
        >
          <Ionicons name="options" size={20} color={Colors.text.primary} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      {!isLoading && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {jobs.length === 0
              ? "لا توجد نتائج"
              : `${jobs.length} ${jobs.length === 1 ? "وظيفة" : "وظيفة"} متاحة`}
          </Text>
          {filters.searchTerm && (
            <Text style={styles.searchQuery}>نتائج البحث عن: "{filters.searchTerm}"</Text>
          )}
        </View>
      )}

      {/* Active Filters */}
      {hasActiveFilters() && (
        <View style={styles.activeFiltersSection}>
          <View style={styles.activeFiltersHeader}>
            <Text style={styles.activeFiltersTitle}>الفلاتر النشطة</Text>
            <TouchableOpacity onPress={clearAllFilters} style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>مسح الكل</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activeFiltersContainer}>{renderActiveFilters()}</View>
        </View>
      )}
    </View>
  );

  const renderJobItem = ({ item }: { item: any }) => (
    <View style={styles.jobCardContainer}>
      <JobCard job={item} style={styles.jobCard} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "auto" : "dark"} />

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={isLoading ? renderLoadingState : renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.contentContainer,
          jobs.length === 0 && !isLoading && styles.emptyContentContainer,
        ]}
        showsVerticalScrollIndicator={false}
        onRefresh={handleSearch}
        refreshing={isRefetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />

      <FilterBottomSheet
        ref={filterBottomSheetRef}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  searchSection: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    // paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  backButton: {
    padding: 8,
    marginRight: I18nManager.isRTL ? 0 : 8,
    marginLeft: I18nManager.isRTL ? 8 : 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
  },
  clearButton: {
    padding: 4,
    marginLeft: I18nManager.isRTL ? 0 : 8,
    marginRight: I18nManager.isRTL ? 8 : 0,
  },
  filterButton: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: Colors.white,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  filterBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "RZ-Bold",
  },
  activeFiltersSection: {
    marginTop: 8,
  },
  activeFiltersHeader: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activeFiltersTitle: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background.light,
    borderRadius: 16,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "RZ-Medium",
  },
  activeFiltersContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  activeFilter: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingLeft: I18nManager.isRTL ? 12 : 4,
    paddingRight: I18nManager.isRTL ? 4 : 12,
    paddingVertical: 6,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Medium",
  },
  removeFilterButton: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.lightGrey,
  },
  jobCardContainer: {
    backgroundColor: Colors.white,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  jobCard: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginTop: 16,
    textAlign: "center",
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
  resultsHeader: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
  searchQuery: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: "RZ-Reg",
  },
});
