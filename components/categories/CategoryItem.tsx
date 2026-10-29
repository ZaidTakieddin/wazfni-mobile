import { Colors } from "@/constants/Colors";
import { Category } from "@/types/categories";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgIcon from "../SvgIcon";

interface CategoryItemProps {
  category: Category;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to search results screen with category filter applied
    router.push({
      pathname: "/(app)/(search)/results",
      params: {
        categoryId: category.id,
        categoryName: category.name,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <SvgIcon name={"settings"} size={24} color={Colors.white} />
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    marginHorizontal: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    width: 56,
  },
});
