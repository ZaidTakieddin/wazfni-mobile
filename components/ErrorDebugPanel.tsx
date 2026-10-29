import { Colors } from "@/constants/Colors";
import errorLogger from "@/services/errorLogger";
import globalErrorHandler from "@/services/globalErrorHandler";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Only show in development
const ErrorDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(errorLogger.getErrorStats());

  if (!__DEV__) {
    return null;
  }

  const refreshStats = () => {
    setStats(errorLogger.getErrorStats());
  };

  const triggerJavaScriptError = () => {
    setTimeout(() => {
      throw new Error("Test JavaScript error from debug panel");
    }, 100);
  };

  const triggerReactError = () => {
    // This will cause a React error by trying to render an invalid element
    throw new Error("Test React error from debug panel");
  };

  const triggerPromiseRejection = () => {
    Promise.reject(new Error("Test unhandled promise rejection"));
  };

  const triggerConsoleError = () => {
    console.error("Test console.error from debug panel");
  };

  const reportManualError = () => {
    globalErrorHandler.reportError(
      new Error("Manually reported test error"),
      "Debug Panel",
      "medium"
    );
    refreshStats();
  };

  const clearErrors = () => {
    errorLogger.clearStoredErrors();
    refreshStats();
    Alert.alert("تم المسح", "تم مسح جميع الأخطاء المحفوظة");
  };

  const showErrorDetails = () => {
    const errors = errorLogger.getStoredErrors();
    const errorSummary = errors
      .slice(0, 5)
      .map((error, index) => `${index + 1}. ${error.message} (${error.errorType})`)
      .join("\n");

    Alert.alert(
      "تفاصيل الأخطاء",
      errors.length > 0
        ? `آخر ${Math.min(5, errors.length)} أخطاء:\n\n${errorSummary}`
        : "لا توجد أخطاء محفوظة",
      [{ text: "موافق" }]
    );
  };

  if (!isVisible) {
    return (
      <TouchableOpacity style={styles.debugButton} onPress={() => setIsVisible(true)}>
        <Text style={styles.debugButtonText}>🐛 DEBUG</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>مجموعة أدوات تصحيح الأخطاء</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Error Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>إحصائيات الأخطاء</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshStats}>
              <Text style={styles.refreshButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>المجموع</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>الأخيرة (ساعة)</Text>
              <Text style={styles.statValue}>{stats.recent}</Text>
            </View>
          </View>

          <View style={styles.typeBreakdown}>
            <Text style={styles.breakdownTitle}>حسب النوع:</Text>
            {Object.entries(stats.byType).map(([type, count]) => (
              <Text key={type} style={styles.breakdownItem}>
                {type}: {count}
              </Text>
            ))}
          </View>

          <View style={styles.severityBreakdown}>
            <Text style={styles.breakdownTitle}>حسب الشدة:</Text>
            {Object.entries(stats.bySeverity).map(([severity, count]) => (
              <Text key={severity} style={styles.breakdownItem}>
                {severity}: {count}
              </Text>
            ))}
          </View>
        </View>

        {/* Error Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختبار الأخطاء</Text>

          <TouchableOpacity
            style={[styles.testButton, styles.jsErrorButton]}
            onPress={triggerJavaScriptError}
          >
            <Text style={styles.testButtonText}>خطأ JavaScript</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, styles.reactErrorButton]}
            onPress={triggerReactError}
          >
            <Text style={styles.testButtonText}>خطأ React</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, styles.promiseErrorButton]}
            onPress={triggerPromiseRejection}
          >
            <Text style={styles.testButtonText}>Promise Rejection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, styles.consoleErrorButton]}
            onPress={triggerConsoleError}
          >
            <Text style={styles.testButtonText}>Console Error</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, styles.manualErrorButton]}
            onPress={reportManualError}
          >
            <Text style={styles.testButtonText}>تقرير يدوي</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإجراءات</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton]}
            onPress={showErrorDetails}
          >
            <Text style={styles.actionButtonText}>عرض التفاصيل</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={clearErrors}>
            <Text style={styles.actionButtonText}>مسح الأخطاء</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    top: 100,
    right: 10,
    backgroundColor: "#ff6b35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1000,
  },
  debugButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  container: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    bottom: 50,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: Colors.border.light,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
  },
  refreshButton: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButtonText: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    fontFamily: "RZ-Bold",
  },
  typeBreakdown: {
    marginTop: 10,
  },
  severityBreakdown: {
    marginTop: 10,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 5,
    fontFamily: "RZ-Bold",
  },
  breakdownItem: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  testButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    alignItems: "center",
  },
  jsErrorButton: {
    backgroundColor: "#dc3545",
  },
  reactErrorButton: {
    backgroundColor: "#fd7e14",
  },
  promiseErrorButton: {
    backgroundColor: "#6f42c1",
  },
  consoleErrorButton: {
    backgroundColor: "#20c997",
  },
  manualErrorButton: {
    backgroundColor: "#0d6efd",
  },
  testButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "RZ-Bold",
  },
  actionButton: {
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
    alignItems: "center",
  },
  detailsButton: {
    backgroundColor: Colors.primary,
  },
  clearButton: {
    backgroundColor: Colors.danger,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "RZ-Bold",
  },
});

export default ErrorDebugPanel;
