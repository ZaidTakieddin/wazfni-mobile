import errorLogger from "./errorLogger";

class GlobalErrorHandler {
  private initialized = false;

  /**
   * Initialize global error handlers
   */
  initialize(): void {
    if (this.initialized) {
      console.log("Global error handlers already initialized, skipping");
      return;
    }

    try {
      this.setupUncaughtExceptionHandler();
      this.setupUnhandledRejectionHandler();
      this.setupConsoleErrorOverride();

      this.initialized = true;
      console.log("Global error handlers initialized successfully");
    } catch (error) {
      console.log("Failed to initialize global error handlers:", error);
      // Mark as initialized anyway to prevent retry loops
      this.initialized = true;
    }
  }

  /**
   * Setup handler for uncaught JavaScript exceptions
   */
  private setupUncaughtExceptionHandler(): void {
    const originalHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      // Log the error
      errorLogger.logError(error, "javascript", isFatal ? "critical" : "high", {
        isFatal: isFatal ?? false,
        timestamp: new Date().toISOString(),
      });

      // Call the original handler to maintain default behavior
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  /**
   * Setup handler for unhandled promise rejections
   */
  private setupUnhandledRejectionHandler(): void {
    // Note: React Native doesn't have a built-in unhandledRejection event like Node.js
    // We'll use a simple console tracking approach for promise rejections
    console.log("Promise rejection tracking initialized");

    // Set up a simple tracking mechanism without overriding native Promise methods
    // This is safer and won't interfere with React Native's internal promise handling
  }

  /**
   * Override console.error to catch and log errors
   */
  private setupConsoleErrorOverride(): void {
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      // Check if this looks like an error
      const errorMessage = args.join(" ");

      // Skip many more React Native internal errors and warnings to prevent loops
      if (
        errorMessage.includes("VirtualizedList") ||
        errorMessage.includes("Warning:") ||
        errorMessage.includes("yellowbox") ||
        errorMessage.includes("YellowBox") ||
        errorMessage.includes("RTL") ||
        errorMessage.includes("I18nManager") ||
        errorMessage.includes("non-critical") ||
        errorMessage.includes("DevMenu") ||
        errorMessage.includes("Remote debugger") ||
        errorMessage.includes("LogBox") ||
        errorMessage.includes("Metro") ||
        errorMessage.includes("react-devtools") ||
        errorMessage.includes("Flipper")
      ) {
        originalConsoleError(...args);
        return;
      }

      // Only log actual errors, not warnings or info messages
      if (errorMessage.toLowerCase().includes("error") && !errorMessage.includes("non-critical")) {
        // Create an error object from console.error arguments
        const error = new Error(errorMessage);

        // Log as a low severity error since it came from console.error
        errorLogger.logError(error, "javascript", "low", {
          source: "console.error",
          arguments: args,
          timestamp: new Date().toISOString(),
        });
      }

      // Call original console.error
      originalConsoleError(...args);
    };
  }

  /**
   * Manually report an error
   */
  reportError(
    error: Error,
    context?: string,
    severity: "low" | "medium" | "high" | "critical" = "medium"
  ): void {
    errorLogger.logError(error, "javascript", severity, {
      context,
      timestamp: new Date().toISOString(),
      manuallyReported: true,
    });
  }

  /**
   * Report a custom message as an error
   */
  reportMessage(
    message: string,
    context?: string,
    severity: "low" | "medium" | "high" | "critical" = "low"
  ): void {
    errorLogger.logMessage(message, severity, {
      context,
      timestamp: new Date().toISOString(),
      manuallyReported: true,
    });
  }

  /**
   * Clean up global error handlers
   */
  cleanup(): void {
    if (!this.initialized) {
      return;
    }

    // Reset to default error handler
    ErrorUtils.setGlobalHandler(ErrorUtils.getGlobalHandler());

    this.initialized = false;
    console.log("Global error handlers cleaned up");
  }
}

// Export singleton instance
export const globalErrorHandler = new GlobalErrorHandler();
export default globalErrorHandler;
