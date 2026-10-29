import Constants from "expo-constants";
import { Platform } from "react-native";

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  platform: string;
  appVersion: string;
  userId?: string;
  userAgent?: string;
  url?: string;
  errorType: "javascript" | "react" | "promise" | "native";
  severity: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, any>;
}

class ErrorLogger {
  private errors: ErrorInfo[] = [];
  private maxStoredErrors = 50;

  /**
   * Log an error with detailed information
   */
  logError(
    error: Error,
    errorType: ErrorInfo["errorType"] = "javascript",
    severity: ErrorInfo["severity"] = "medium",
    metadata?: Record<string, any>,
    componentStack?: string
  ): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      appVersion: Constants.expoConfig?.version || "unknown",
      errorType,
      severity,
      metadata: {
        ...metadata,
        name: error.name,
        cause: error.cause,
      },
    };

    this.storeError(errorInfo);
    this.logToConsole(errorInfo);

    // In production, you would send this to your logging service
    if (!__DEV__) {
      this.sendToLoggingService(errorInfo);
    }
  }

  /**
   * Log a custom message as an error
   */
  logMessage(
    message: string,
    severity: ErrorInfo["severity"] = "low",
    metadata?: Record<string, any>
  ): void {
    const errorInfo: ErrorInfo = {
      message,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      appVersion: Constants.expoConfig?.version || "unknown",
      errorType: "javascript",
      severity,
      metadata,
    };

    this.storeError(errorInfo);
    this.logToConsole(errorInfo);

    if (!__DEV__) {
      this.sendToLoggingService(errorInfo);
    }
  }

  /**
   * Store error in local array (limited storage)
   */
  private storeError(errorInfo: ErrorInfo): void {
    this.errors.unshift(errorInfo);

    // Keep only the most recent errors
    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors);
    }
  }

  /**
   * Log error to console with formatting
   */
  private logToConsole(errorInfo: ErrorInfo): void {
    const prefix = `[${errorInfo.errorType.toUpperCase()}] [${errorInfo.severity.toUpperCase()}]`;

    console.group(`${prefix} Error at ${errorInfo.timestamp}`);
    console.error("Message:", errorInfo.message);

    if (errorInfo.stack) {
      console.error("Stack:", errorInfo.stack);
    }

    if (errorInfo.componentStack) {
      console.error("Component Stack:", errorInfo.componentStack);
    }

    if (errorInfo.metadata) {
      console.error("Metadata:", errorInfo.metadata);
    }

    console.groupEnd();
  }

  /**
   * Send error to external logging service
   * Replace this with your actual logging service (Sentry, LogRocket, etc.)
   */
  private async sendToLoggingService(errorInfo: ErrorInfo): Promise<void> {
    try {
      // Example: Send to your backend logging endpoint
      // await fetch('/api/v1/logs/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorInfo)
      // });

      // For now, we'll just log that we would send it
      console.log("Would send error to logging service:", errorInfo.message);
    } catch (error) {
      console.error("Failed to send error to logging service:", error);
    }
  }

  /**
   * Get all stored errors
   */
  getStoredErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * Clear all stored errors
   */
  clearStoredErrors(): void {
    this.errors = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: number; // errors in last hour
  } {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const stats = {
      total: this.errors.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      recent: 0,
    };

    this.errors.forEach((error) => {
      // Count by type
      stats.byType[error.errorType] = (stats.byType[error.errorType] || 0) + 1;

      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;

      // Count recent errors
      if (error.timestamp > oneHourAgo) {
        stats.recent++;
      }
    });

    return stats;
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();
export default errorLogger;
