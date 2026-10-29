import { Colors } from "@/constants/Colors";
import errorLogger from "@/services/errorLogger";
import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    errorLogger.logError(
      error,
      "react",
      "high",
      {
        retryCount: this.retryCount,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
      },
      errorInfo.componentStack || undefined
    );

    // Store error info in state
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show alert in development
    if (__DEV__) {
      Alert.alert("خطأ في التطبيق", `حدث خطأ غير متوقع: ${error.message}`, [
        {
          text: "موافق",
          style: "default",
        },
      ]);
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    } else {
      Alert.alert(
        "فشل في إعادة المحاولة",
        "تم تجاوز الحد الأقصى لعدد المحاولات. يرجى إعادة تشغيل التطبيق.",
        [
          {
            text: "موافق",
            style: "default",
          },
        ]
      );
    }
  };

  handleRestart = () => {
    // Reset retry count and state
    this.retryCount = 0;
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    if (error) {
      // Create a detailed error report
      const report = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
        retryCount: this.retryCount,
      };

      // In a real app, you might send this to a support system
      Alert.alert("تقرير الخطأ", "تم تسجيل الخطأ. سيتم إرساله إلى فريق الدعم الفني.", [
        {
          text: "موافق",
          style: "default",
        },
      ]);

      console.log("Error report:", report);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>حدث خطأ غير متوقع</Text>

            <Text style={styles.message}>
              نعتذر، حدث خطأ في التطبيق. يمكنك المحاولة مرة أخرى أو إعادة تشغيل التطبيق.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>تفاصيل الخطأ (وضع التطوير):</Text>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
                {this.state.error.stack && (
                  <Text style={styles.stackTrace} numberOfLines={10}>
                    {this.state.error.stack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              {this.retryCount < this.maxRetries && (
                <TouchableOpacity
                  style={[styles.button, styles.retryButton]}
                  onPress={this.handleRetry}
                >
                  <Text style={styles.buttonText}>
                    إعادة المحاولة ({this.maxRetries - this.retryCount} محاولات متبقية)
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.restartButton]}
                onPress={this.handleRestart}
              >
                <Text style={styles.buttonText}>إعادة تشغيل</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.reportButton]}
                onPress={this.handleReportError}
              >
                <Text style={styles.buttonText}>إبلاغ عن المشكلة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "RZ-Bold",
  },
  message: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: "RZ-Reg",
  },
  errorDetails: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dc3545",
    marginBottom: 8,
    fontFamily: "RZ-Bold",
  },
  errorText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
    fontFamily: "RZ-Reg",
  },
  stackTrace: {
    fontSize: 10,
    color: "#6c757d",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
  },
  restartButton: {
    backgroundColor: "#28a745",
  },
  reportButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "RZ-Bold",
  },
});

export default ErrorBoundary;
