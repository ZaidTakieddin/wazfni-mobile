import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import useGetCategories from "@/hooks/categories/use-get-categories";
import { isRTL } from "@/utils/rtl";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Categories() {
  const { allData: categories } = useGetCategories();
  const router = useRouter();

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    // Navigate to search results screen with category filter applied
    router.push({
      pathname: "/(app)/(search)/results",
      params: {
        categoryId,
        categoryName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التصنيفات</Text>
        <Link
          href=".."
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

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.gridContainer}>
            {categories?.map((item) => (
              <TouchableOpacity
                key={`${item.id}`}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(item.id, item.name)}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={"cog-outline"} size={28} color="white" />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryItem: {
    alignItems: "center",
    width: "25%",
    marginBottom: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: Colors.text.primary,
    textAlign: "center",
    fontFamily: "RZ-Reg",
  },
});
