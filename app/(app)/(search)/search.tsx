import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { isRTL } from "@/utils/rtl";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<
    { id: string; query: string; timestamp: Date }[]
  >([]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      const history = await SecureStore.getItemAsync("searchHistory");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    };
    loadSearchHistory();
  }, []);

  const handleDeleteItem = (id: string) => {
    setSearchHistory(searchHistory.filter((item) => item.id !== id));
    SecureStore.setItemAsync(
      "searchHistory",
      JSON.stringify(searchHistory.filter((item) => item.id !== id))
    );
  };

  const handleDeleteAll = async () => {
    await SecureStore.deleteItemAsync("searchHistory");
    setSearchHistory([]);
  };

  const handleSearch = (query?: string) => {
    router.push({
      pathname: "/results",
      params: {
        query: query || searchQuery,
      },
    });
    if (searchQuery.trim()) {
      // Add to search history
      const newItem = {
        id: Date.now().toString(),
        query: query || searchQuery,
        timestamp: new Date(),
      };
      if (!searchHistory.some((item) => item.query === newItem.query)) {
        SecureStore.setItemAsync("searchHistory", JSON.stringify([newItem, ...searchHistory]));
        setSearchHistory([newItem, ...searchHistory]);
      }
      setSearchQuery("");
    }
  };

  const SearchHistoryItem = ({ item }: { item: (typeof searchHistory)[0] }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => {
        setSearchQuery(item.query);
        handleSearch(item.query);
      }}
    >
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
        <AntDesign name="close" size={14} color="#6B7280" />
      </TouchableOpacity>

      <View style={styles.searchItemContent}>
        <View style={styles.timeIconContainer}>
          <Ionicons name="time-outline" size={24} color="#6B7280" />
        </View>
        <Text style={styles.searchText}>{item.query}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <StatusBar style={Platform.OS == "ios" ? "light" : "light"} />
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={() => router.back()}>
          <Feather name="arrow-right" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Pressable>
            <SvgIcon name="search" size={24} color={Colors.text.secondary} />
          </Pressable>
          <TextInput
            style={styles.searchInput}
            placeholder="بحث"
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
            autoFocus={true}
          />
        </View>
      </View>

      {/* Search History Header */}
      {searchHistory.length > 0 ? (
        <View style={{ flex: 1, backgroundColor: Colors.background.light }}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>عمليات البحث الأخيرة</Text>
            <TouchableOpacity onPress={handleDeleteAll}>
              <Text style={styles.deleteAllText}>حذف الكل</Text>
            </TouchableOpacity>
          </View>

          {/* Search History List */}
          <FlatList
            data={searchHistory}
            renderItem={({ item }) => <SearchHistoryItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.historyList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.historyHeaderEmpty}>
          <Text style={styles.historyTitle}>لا يوجد عمليات بحث</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 48,
  },
  searchContainer: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.primary,
  },
  inputContainer: {
    flex: 1,
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    height: 40,
    borderWidth: 1,
    gap: 8,
    borderColor: Colors.border.light,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text.secondary,
    fontSize: 12,
    fontFamily: "RZ-Reg",
    textAlign: "right",
    textAlignVertical: "center",
  },
  searchButton: {
    padding: 5,
    color: Colors.text.secondary,
  },
  historyHeader: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  historyTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  deleteAllText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  historyList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  searchItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 8,
  },
  deleteButton: {},
  searchItemContent: {
    flex: 1,
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  timeIconContainer: {
    marginHorizontal: 10,
  },
  searchText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: "right",
    fontFamily: "RZ-Reg",
  },
  historyHeaderEmpty: {
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: Colors.background.light,
    flex: 1,
    paddingVertical: 16,
  },
});
