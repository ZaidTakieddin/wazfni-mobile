import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SearchEmptyStateProps {
  searchTerm?: string;
  hasFilters?: boolean;
}

const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ searchTerm, hasFilters }) => {
  const getEmptyStateContent = () => {
    if (searchTerm && hasFilters) {
      return {
        icon: "search-outline" as const,
        title: "لا توجد نتائج مطابقة",
        subtitle: `لم نجد وظائف تحتوي على "${searchTerm}" مع الفلاتر المحددة`,
        suggestion: "جرب تعديل الفلاتر أو البحث بكلمات مختلفة",
      };
    } else if (searchTerm) {
      return {
        icon: "search-outline" as const,
        title: "لا توجد نتائج للبحث",
        subtitle: `لم نجد وظائف تحتوي على "${searchTerm}"`,
        suggestion: "جرب البحث بكلمات مختلفة أو تحقق من الأخطاء الإملائية",
      };
    } else if (hasFilters) {
      return {
        icon: "filter-outline" as const,
        title: "لا توجد وظائف مطابقة",
        subtitle: "لم نجد وظائف تطابق الفلاتر المحددة",
        suggestion: "جرب إزالة بعض الفلاتر أو توسيع معايير البحث",
      };
    } else {
      return {
        icon: "briefcase-outline" as const,
        title: "ابدأ بالبحث عن الوظائف",
        subtitle: "ابحث عن الوظائف التي تناسبك أو استخدم الفلاتر للعثور على الفرص المناسبة",
        suggestion: "جرب البحث بكلمة مفتاحية أو استخدم الفلاتر المتاحة",
      };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={content.icon} size={64} color={Colors.text.secondary} />
      </View>

      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.subtitle}</Text>
      <Text style={styles.suggestion}>{content.suggestion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    backgroundColor: Colors.background.light,
    borderRadius: 40,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  suggestion: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default SearchEmptyState;
