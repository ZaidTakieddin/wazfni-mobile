import SvgIcon from "@/components/SvgIcon";
import { Colors } from "@/constants/Colors";
import { isRTL } from "@/utils/rtl";
import { Link } from "expo-router";
import React from "react";
import {
  I18nManager,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سياسة الخصوصية</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>
          نرحب بكم في تطبيق وظفني. ندرك أهمية خصوصيتكم ونلتزم بحماية البيانات الشخصية التي تشاركونها
          معنا.
        </Text>

        <Text style={styles.policyText}>
          نشرح هذه السياسة كيفية جمعنا واستخدامنا ومشاركة وحماية معلوماتكم الشخصية عند استخدام
          التطبيق.
        </Text>

        <Text style={styles.policyText}>
          يرجى قراءة هذه السياسة بعناية، وفي حال عدم موافقتكم على أي بند من بنودها، ننصحكم بعدم
          استخدام التطبيق.
        </Text>

        <Text style={styles.welcomeText}>
          نرحب بكم في تطبيق وظفني. ندرك أهمية خصوصيتكم ونلتزم بحماية البيانات الشخصية التي تشاركونها
          معنا.
        </Text>

        <Text style={styles.policyText}>
          نشرح هذه السياسة كيفية جمعنا واستخدامنا ومشاركة وحماية معلوماتكم الشخصية عند استخدام
          التطبيق.
        </Text>

        <Text style={styles.policyText}>
          يرجى قراءة هذه السياسة بعناية، وفي حال عدم موافقتكم على أي بند من بنودها، ننصحكم بعدم
          استخدام التطبيق.
        </Text>
      </ScrollView>
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
    justifyContent: "center",
    gap: 24,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 28 : 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGrey,
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginTop: Platform.OS === "ios" ? 6 : 0,
  },
  content: {
    flex: 1,
    padding: 16,
    direction: I18nManager.isRTL ? "ltr" : "rtl",
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
    lineHeight: 24,
    marginBottom: 16,
  },
  policyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "right",
    lineHeight: 24,
    marginBottom: 16,
  },
});
