import { Colors } from "@/constants/Colors";
import { useGetCategoriesUnpaginated } from "@/hooks/categories/use-get-categories";
import { useGetSubcategoriesUnpaginated } from "@/hooks/categories/use-get-subcategories";
import {
  cities,
  contractTypeOptions,
  experienceLevelOptions,
  workTypeOptions,
} from "@/types/enums";
import { JobFilters } from "@/types/jobs";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Animated,
  Dimensions,
  I18nManager,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export type FilterBottomSheetRef = {
  open: () => void;
  close: () => void;
  reset: () => void;
};

interface FilterBottomSheetProps {
  initialFilters?: Partial<JobFilters>;
  onApplyFilters: (filters: Partial<JobFilters>) => void;
}

const FilterBottomSheet = forwardRef<FilterBottomSheetRef, FilterBottomSheetProps>(
  ({ initialFilters = {}, onApplyFilters }, ref) => {
    const [visible, setVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(height));
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

    // Internal state - this is the single source of truth for the component
    const [filters, setFilters] = useState<Partial<JobFilters>>({
      searchTerm: initialFilters?.searchTerm || "", // Updated to use searchTerm
      city: initialFilters?.city || "",
      companyName: initialFilters?.companyName || "",
      subCategoryId: initialFilters?.subCategoryId || "", // Updated to match API
      workType: initialFilters?.workType || [],
      contractType: initialFilters?.contractType || [],
      experienceLevel: initialFilters?.experienceLevel || [],
      minSalary: initialFilters?.minSalary || "",
      maxSalary: initialFilters?.maxSalary || "",
    });

    // Category selection state
    const [selectedCity, setSelectedCity] = useState(filters?.city || "");
    const [companySearch, setCompanySearch] = useState(filters?.companyName || "");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
      filters?.subCategoryId || "" // Updated to match API
    );
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("");
    const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(filters?.workType || []);
    const [selectedContractTypes, setSelectedContractTypes] = useState<string[]>(
      filters?.contractType || []
    );
    const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>(
      filters?.experienceLevel || []
    );
    const [minSalary, setMinSalary] = useState(filters?.minSalary || "");
    const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || "");

    // Fetch categories and subcategories
    const { data: categories } = useGetCategoriesUnpaginated();
    const { data: subcategories } = useGetSubcategoriesUnpaginated(selectedCategoryId);

    // Reset local state when filters prop changes
    useEffect(() => {
      setSelectedCity(filters?.city || "");
      setCompanySearch(filters?.companyName || "");
      setSelectedSubcategoryId(filters?.subCategoryId || ""); // Updated to match API
      setSelectedWorkTypes(filters?.workType || []);
      setSelectedContractTypes(filters?.contractType || []);
      setSelectedExperienceLevels(filters?.experienceLevel || []);
      setMinSalary(filters?.minSalary || "");
      setMaxSalary(filters?.maxSalary || "");
    }, [filters]);

    // Initialize selected category and subcategory names on mount
    useEffect(() => {
      if (filters?.subCategoryId && categories && subcategories) {
        // Updated to match API
        const subcategory = subcategories.find((sub) => sub.id === filters.subCategoryId);
        if (subcategory) {
          setSelectedSubcategoryName(subcategory.name);
        }
      }
    }, [filters?.subCategoryId, categories, subcategories]); // Updated to match API

    const open = () => {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const close = () => {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    };

    const reset = () => {
      setSelectedCity(initialFilters?.city || "");
      setCompanySearch(initialFilters?.companyName || "");
      setSelectedSubcategoryId(initialFilters?.subCategoryId || ""); // Updated to match API
      setSelectedWorkTypes(initialFilters?.workType || []);
      setSelectedContractTypes(initialFilters?.contractType || []);
      setSelectedExperienceLevels(initialFilters?.experienceLevel || []);
      setMinSalary(initialFilters?.minSalary || "");
      setMaxSalary(initialFilters?.maxSalary || "");
      setSelectedCategoryId("");
      setSelectedCategoryName("");
      setSelectedSubcategoryName("");
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
      reset,
    }));

    const toggleArraySelection = (
      array: string[],
      setArray: (value: string[]) => void,
      value: string
    ) => {
      if (array.includes(value)) {
        setArray(array.filter((item) => item !== value));
      } else {
        setArray([...array, value]);
      }
    };

    const applyFilters = () => {
      // Use the current state and ensure proper category/subcategory handling
      const newFilters = {
        searchTerm: initialFilters?.searchTerm || "",
        city: selectedCity,
        companyName: companySearch,
        categoryId: selectedCategoryId,
        subCategoryId: selectedSubcategoryName ? selectedSubcategoryId : "",
        workType: selectedWorkTypes,
        contractType: selectedContractTypes,
        experienceLevel: selectedExperienceLevels,
        minSalary,
        maxSalary,
      };

      // Only include non-empty IDs and completely remove empty subCategoryId
      const filtered: Partial<typeof newFilters> = { ...newFilters };

      // Remove categoryId if empty
      if (!selectedCategoryId) {
        delete filtered.categoryId;
      }

      // Remove subCategoryId if empty (since it's optional)
      if (!selectedSubcategoryId) {
        delete filtered.subCategoryId;
      }

      onApplyFilters(filtered);
      // Don't close the sheet
    };

    const toggleCityDropdown = () => {
      setShowCityDropdown(!showCityDropdown);
      setShowCategoryDropdown(false);
      setShowSubcategoryDropdown(false);
    };

    const toggleCategoryDropdown = () => {
      setShowCategoryDropdown(!showCategoryDropdown);
      setShowCityDropdown(false);
      setShowSubcategoryDropdown(false);
    };

    const toggleSubcategoryDropdown = () => {
      if (selectedCategoryId) {
        setShowSubcategoryDropdown(!showSubcategoryDropdown);
        setShowCityDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    const selectCity = (city: string) => {
      setSelectedCity(city);
      setShowCityDropdown(false);
    };

    const selectCategory = (categoryId: string, categoryName: string) => {
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
      setSelectedSubcategoryId(""); // Reset subcategory when category changes
      setSelectedSubcategoryName("");
      setShowCategoryDropdown(false);
      // Don't apply filters immediately - only when Apply button is clicked
    };

    const selectSubcategory = (subcategoryId: string, subcategoryName: string) => {
      setSelectedSubcategoryId(subcategoryId);
      setSelectedSubcategoryName(subcategoryName);
      setShowSubcategoryDropdown(false);
      // Don't apply filters immediately - only when Apply button is clicked
    };

    // Get active filters count for display
    const getActiveFiltersCount = () => {
      let count = 0;
      if (selectedCity) count++;
      if (companySearch) count++;
      if (selectedSubcategoryId) count++;
      if (selectedWorkTypes.length > 0) count += selectedWorkTypes.length;
      if (selectedContractTypes.length > 0) count += selectedContractTypes.length;
      if (selectedExperienceLevels.length > 0) count += selectedExperienceLevels.length;
      if (minSalary || maxSalary) count++;
      return count;
    };

    const renderFilterSection = (title: string, children: React.ReactNode) => (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    );

    const renderMultiSelectChips = (
      options: { label: string; value: string }[],
      selectedValues: string[],
      onToggle: (value: string) => void
    ) => (
      <View style={styles.chipContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, selectedValues.includes(option.value) && styles.selectedChip]}
            onPress={() => onToggle(option.value)}
          >
            <Text
              style={[
                styles.chipText,
                selectedValues.includes(option.value) && styles.selectedChipText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    const renderDropdown = (
      value: string,
      placeholder: string,
      onPress: () => void,
      isOpen: boolean,
      disabled = false
    ) => (
      <TouchableOpacity
        style={[styles.dropdown, disabled && styles.disabledDropdown]}
        onPress={onPress}
        disabled={disabled}
      >
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={disabled ? Colors.text.secondary : Colors.text.primary}
        />
        <Text style={[styles.dropdownText, disabled && styles.disabledText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    );

    return (
      <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={close} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.title}>الفلاتر</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              {/* Category Filter */}
              {renderFilterSection(
                "التصنيف",
                <View style={styles.dropdownContainer}>
                  {renderDropdown(
                    selectedCategoryName,
                    "اختر التصنيف",
                    toggleCategoryDropdown,
                    showCategoryDropdown
                  )}

                  {showCategoryDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownListScroll} nestedScrollEnabled>
                        {categories?.map((category) => (
                          <TouchableOpacity
                            key={category.id}
                            style={styles.dropdownItem}
                            onPress={() => selectCategory(category.id, category.name)}
                          >
                            <Text style={styles.dropdownItemText}>{category.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}

              {/* Subcategory Filter */}
              {renderFilterSection(
                "التصنيف الفرعي",
                <View style={styles.dropdownContainer}>
                  {renderDropdown(
                    selectedSubcategoryName,
                    selectedCategoryId ? "اختر التصنيف الفرعي" : "اختر التصنيف أولاً",
                    toggleSubcategoryDropdown,
                    showSubcategoryDropdown,
                    !selectedCategoryId
                  )}

                  {showSubcategoryDropdown && subcategories && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownListScroll} nestedScrollEnabled>
                        {subcategories.map((subcategory) => (
                          <TouchableOpacity
                            key={subcategory.id}
                            style={styles.dropdownItem}
                            onPress={() => selectSubcategory(subcategory.id, subcategory.name)}
                          >
                            <Text style={styles.dropdownItemText}>{subcategory.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}

              {/* City Filter */}
              {renderFilterSection(
                "المدينة",
                <View style={styles.dropdownContainer}>
                  {renderDropdown(
                    selectedCity,
                    "اختر المدينة",
                    toggleCityDropdown,
                    showCityDropdown
                  )}

                  {showCityDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownListScroll} nestedScrollEnabled>
                        {cities.map((city) => (
                          <TouchableOpacity
                            key={city.value}
                            style={styles.dropdownItem}
                            onPress={() => selectCity(city.value)}
                          >
                            <Text style={styles.dropdownItemText}>{city.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}

              {/* Company Filter */}
              {renderFilterSection(
                "الشركة",
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن شركة..."
                    placeholderTextColor={Colors.text.secondary}
                    value={companySearch}
                    onChangeText={setCompanySearch}
                    textAlign="right"
                  />
                  <Feather name="search" size={18} color={Colors.text.secondary} />
                </View>
              )}

              {/* Work Type Filter */}
              {renderFilterSection(
                "نوع العمل",
                renderMultiSelectChips(workTypeOptions, selectedWorkTypes, (value) =>
                  toggleArraySelection(selectedWorkTypes, setSelectedWorkTypes, value)
                )
              )}

              {/* Contract Type Filter */}
              {renderFilterSection(
                "نوع التعاقد",
                renderMultiSelectChips(contractTypeOptions, selectedContractTypes, (value) =>
                  toggleArraySelection(selectedContractTypes, setSelectedContractTypes, value)
                )
              )}

              {/* Experience Level Filter */}
              {renderFilterSection(
                "مستوى الخبرة",
                renderMultiSelectChips(experienceLevelOptions, selectedExperienceLevels, (value) =>
                  toggleArraySelection(selectedExperienceLevels, setSelectedExperienceLevels, value)
                )
              )}

              {/* Salary Range Filter */}
              {renderFilterSection(
                "نطاق الراتب",
                <View style={styles.salaryContainer}>
                  <View style={styles.salaryInputContainer}>
                    <Text style={styles.salaryLabel}>من</Text>
                    <TextInput
                      style={styles.salaryInput}
                      placeholder="0"
                      placeholderTextColor={Colors.text.secondary}
                      value={minSalary}
                      onChangeText={setMinSalary}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>
                  <View style={styles.salaryDivider} />
                  <View style={styles.salaryInputContainer}>
                    <Text style={styles.salaryLabel}>إلى</Text>
                    <TextInput
                      style={styles.salaryInput}
                      placeholder="∞"
                      placeholderTextColor={Colors.text.secondary}
                      value={maxSalary}
                      onChangeText={setMaxSalary}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={reset}>
                <Text style={styles.resetButtonText}>إعادة ضبط</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>
                  تطبيق الفلاتر {getActiveFiltersCount() > 0 ? `(${getActiveFiltersCount()})` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

FilterBottomSheet.displayName = "FilterBottomSheet";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: height * 0.75,
    maxHeight: height * 0.9,
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.light,
  },
  title: {
    fontSize: 18,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    flex: 1,
    textAlign: "center",
  },
  filterBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: "RZ-Bold",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
    fontFamily: "RZ-Bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdown: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabledDropdown: {
    backgroundColor: Colors.background.light,
    borderColor: Colors.border.lightGrey,
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    flex: 1,
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  disabledText: {
    color: Colors.text.secondary,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginTop: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownListScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
    lineHeight: 24,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  searchContainer: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
  },
  chipContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.background.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    lineHeight: 24,
  },
  selectedChipText: {
    color: Colors.white,
  },
  salaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  salaryInputContainer: {
    flex: 1,
    alignItems: "center",
  },
  salaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginBottom: 8,
    lineHeight: 24,
  },
  salaryInput: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    width: "100%",
    textAlign: "center",
  },
  salaryDivider: {
    width: 16,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  footer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lightGrey,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  resetButtonText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "RZ-Bold",
  },
});

export default FilterBottomSheet;
