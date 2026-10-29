import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import React from "react";
import { I18nManager, StyleSheet, Text, TouchableOpacity } from "react-native";

const MainLayout = () => {
  return (
    <>
      {!I18nManager.isRTL ? (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: true,
            tabBarButton(props) {
              // @ts-ignore
              return <TouchableOpacity {...props} activeOpacity={1} />;
            },
          }}
        >
          <Tabs.Screen
            name="profile"
            options={{
              title: "حسابي",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="user-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="user-linear" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>حسابي</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="applied-jobs"
            options={{
              title: "المقدم عليها",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="suitcase-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="suitcase-linear" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                  المقدم عليها
                </Text>
              ),
            }}
          />
          <Tabs.Screen
            name="bookmarks"
            options={{
              title: "المحفوظات",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="bookmark-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="bookmark-linear" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>المحفوظات</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="main"
            options={{
              title: "الرئيسية",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="home-angle-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="home-angle-outline" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>الرئيسية</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="viewed-jobs"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="all-jobs"
            options={{
              href: null,
            }}
          />
        </Tabs>
      ) : (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: true,
            tabBarButton(props) {
              // @ts-ignore
              return <TouchableOpacity {...props} activeOpacity={1} />;
            },
          }}
        >
          <Tabs.Screen
            name="main"
            options={{
              title: "الرئيسية",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="home-angle-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="home-angle-outline" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>الرئيسية</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="bookmarks"
            options={{
              title: "المحفوظات",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="bookmark-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="bookmark-linear" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>المحفوظات</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="applied-jobs"
            options={{
              title: "المقدم عليها",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="suitcase-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="suitcase-linear" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                  المقدم عليها
                </Text>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "حسابي",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <SvgIcon name="user-bold" size={24} color={Colors.primary} />
                ) : (
                  <SvgIcon name="user-linear" size={24} color={Colors.text.secondary} />
                ),
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>حسابي</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="viewed-jobs"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="all-jobs"
            options={{
              href: null,
            }}
          />
        </Tabs>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 100,
    paddingTop: 16,
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginTop: 4,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});

export default MainLayout;
