import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import React from "react";
import { I18nManager, Image, StyleSheet, Text, TouchableOpacity } from "react-native";

const CompanyLayout = () => {
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
            name="company-profile"
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
            name="add-job"
            options={{
              title: "إضافة وظيفة",
              tabBarIcon: () => (
                <Image
                  source={require("@/assets/images/plus.png")}
                  style={{ width: 60, height: 60, marginBottom: 10 }}
                  resizeMode="contain"
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={[
                    styles.tabLabel,
                    focused && styles.tabLabelActive,
                    {
                      marginTop: 12,
                    },
                  ]}
                >
                  إضافة وظيفة
                </Text>
              ),
              tabBarStyle: {
                display: "none",
              },
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
            name="edit-job/[jobId]"
            options={{
              href: null,
              tabBarStyle: {
                display: "none",
              },
            }}
          />
          <Tabs.Screen
            name="pending-rejected-jobs"
            options={{
              href: null,
              tabBarStyle: { display: "none" },
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
            name="add-job"
            options={{
              title: "إضافة وظيفة",
              tabBarIcon: () => (
                <Image
                  source={require("@/assets/images/plus.png")}
                  style={{ width: 60, height: 60, marginBottom: 10 }}
                  resizeMode="contain"
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={[
                    styles.tabLabel,
                    focused && styles.tabLabelActive,
                    {
                      marginTop: 12,
                    },
                  ]}
                >
                  إضافة وظيفة
                </Text>
              ),
              tabBarStyle: {
                display: "none",
              },
            }}
          />
          <Tabs.Screen
            name="company-profile"
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
            name="edit-job/[jobId]"
            options={{
              href: null,
              tabBarStyle: {
                display: "none",
              },
            }}
          />
          <Tabs.Screen
            name="pending-rejected-jobs"
            options={{
              href: null,
              tabBarStyle: { display: "none" },
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
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginTop: 4,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});

export default CompanyLayout;
