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

export default function TermsConditions() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الشروط والأحكام</Text>
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
          مرحباً بكم في تطبيق وظفني. هذه الشروط والأحكام تحكم استخدامكم للتطبيق وجميع الخدمات
          المتاحة عبره.
        </Text>

        <Text style={styles.policyText}>
          باستخدام هذا التطبيق، فإنكم توافقون على الالتزام بهذه الشروط والأحكام. إذا كنتم لا توافقون
          على أي من هذه الشروط، يرجى عدم استخدام التطبيق.
        </Text>

        <Text style={styles.sectionTitle}>1. قبول الشروط</Text>
        <Text style={styles.policyText}>
          بوصولكم واستخدامكم لهذا التطبيق، فإنكم تقرون بأنكم قد قرأتم وفهمتم ووافقتم على الالتزام
          بهذه الشروط والأحكام.
        </Text>

        <Text style={styles.sectionTitle}>2. استخدام التطبيق</Text>
        <Text style={styles.policyText}>
          يُسمح لكم باستخدام التطبيق للأغراض المشروعة فقط ووفقاً لهذه الشروط. يُحظر عليكم استخدام
          التطبيق بأي طريقة قد تضر بالتطبيق أو تعطل أو تفسد أو تضعف أدائه.
        </Text>

        <Text style={styles.sectionTitle}>3. حقوق الملكية الفكرية</Text>
        <Text style={styles.policyText}>
          جميع المحتويات والمواد المتاحة في التطبيق محمية بموجب قوانين حقوق الطبع والنشر والعلامات
          التجارية وحقوق الملكية الفكرية الأخرى.
        </Text>

        <Text style={styles.sectionTitle}>4. المسؤولية</Text>
        <Text style={styles.policyText}>
          لا نتحمل أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة قد تنجم عن استخدام التطبيق أو عدم
          القدرة على استخدامه.
        </Text>

        <Text style={styles.sectionTitle}>5. التعديلات</Text>
        <Text style={styles.policyText}>
          نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعاركم بأي تغييرات جوهرية من
          خلال التطبيق.
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
  sectionTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    textAlign: "right",
    lineHeight: 24,
    marginBottom: 8,
    marginTop: 16,
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
