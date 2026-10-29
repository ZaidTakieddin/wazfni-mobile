# 🚨 Crash Handling & Error Management System

This document outlines the comprehensive crash catching and error handling system implemented in the Wazfni app, including fixes for React Native 0.79 compatibility and iOS loop issues.

## 📋 Overview

The app includes a multi-layered error handling system that captures, logs, and manages different types of errors:

- **React Component Errors** (Error Boundaries)
- **JavaScript Runtime Errors** (Global Error Handler)
- **Unhandled Promise Rejections**
- **Console Errors & Warnings**
- **Manual Error Reporting**

## 🏗️ Architecture

### 1. Error Logger Service (`services/errorLogger.ts`)

Central logging service that:
- Stores errors with detailed metadata
- Categorizes errors by type and severity
- Provides error statistics and analytics
- Handles console logging with proper formatting
- Prepares errors for external reporting services

### 2. Global Error Handler (`services/globalErrorHandler.ts`)

Catches uncaught JavaScript errors and sets up global error tracking:
- **ErrorUtils.setGlobalHandler()** - Catches fatal JS errors
- **Console.error override** - Tracks non-fatal console errors
- **Simplified promise rejection tracking** - Safe approach without breaking native Promise handling

### 3. Error Boundary (`components/ErrorBoundary.tsx`)

React Error Boundary that:
- Catches component rendering errors
- Provides fallback UI with retry functionality
- Logs errors with component stack traces
- Offers user-friendly error recovery options

### 4. Error Debug Panel (`components/ErrorDebugPanel.tsx`)

Development-only debug panel that:
- Shows error statistics
- Allows manual error testing
- Triggers different error types for testing
- Only visible in development builds

## 🔧 Recent Fixes & Improvements

### React Native 0.79 Compatibility Fix

**Issue**: The app was crashing with the error:
```
No virtual method getConverters()Lexpo/modules/kotlin/types/TypeConverterProvider; 
in class Lexpo/modules/kotlin/objects/ObjectDefinitionBuilder;
```

**Root Cause**: 
- Version incompatibility between `expo-notifications` and Expo modules core
- Usage of deprecated React Native internal API `installConsoleErrorReporter()`

**Solution**:
1. Updated to **Expo SDK 53.0.17** with compatible package versions
2. Removed deprecated `installConsoleErrorReporter()` call
3. Implemented safer promise rejection tracking

### iOS Infinite Loop Fix

**Issue**: iOS app was stuck in endless reload loops with "javascript low error" messages.

**Root Cause**:
- RTL setup logic causing infinite app reloads
- Aggressive console.error override catching normal warnings
- Error handler initialization happening too early

**Solution**:
1. **Simplified RTL Setup**:
   ```typescript
   // Before: Caused reload loops
   if (!hasSetupRTL && forceRTL !== I18nManager.isRTL) {
     await AsyncStorage.setItem(RTL_SETUP_KEY, "true");
     Updates.reloadAsync(); // ❌ This caused loops
   }

   // After: No reload, safer approach
   if (!hasSetupRTL) {
     await AsyncStorage.setItem(RTL_SETUP_KEY, "true");
     console.log("RTL setup completed without reload"); // ✅ Safe
   }
   ```

2. **Improved Console Error Filtering**:
   ```typescript
   // Added more exclusions to prevent catching normal warnings
   if (
     errorMessage.includes("RTL") ||
     errorMessage.includes("I18nManager") ||
     errorMessage.includes("non-critical") ||
     errorMessage.includes("DevMenu") ||
     // ... more exclusions
   ) {
     originalConsoleError(...args);
     return; // Don't log these
   }
   ```

3. **Delayed Error Handler Initialization**:
   ```typescript
   // Before: Initialized immediately at module load
   globalErrorHandler.initialize(); // At top level

   // After: Initialized after app is ready
   useEffect(() => {
     if (loaded || error) {
       globalErrorHandler.initialize(); // ✅ Safe timing
       SplashScreen.hideAsync();
     }
   }, [loaded, error]);
   ```

## 🚀 Implementation Details

### Error Categories

| Type | Description | Severity Levels |
|------|-------------|----------------|
| `javascript` | Runtime JS errors | low, medium, high, critical |
| `react` | Component rendering errors | high, critical |
| `promise` | Promise rejections | medium, high |
| `native` | Native module errors | high, critical |

### Error Metadata

Each error includes:
- **Timestamp** - When the error occurred
- **Platform** - iOS, Android, or web
- **App Version** - Current app version
- **Stack Trace** - Full error stack
- **Component Stack** - React component hierarchy (for React errors)
- **User Context** - User ID if available
- **Custom Metadata** - Additional context

### Error Storage

- Errors stored locally with rotating buffer (max 50 errors)
- Statistics tracked for analytics
- Prepared for external service integration (Sentry, Bugsnag, etc.)

## 🛠️ Usage Examples

### Manual Error Reporting

```typescript
import globalErrorHandler from '@/services/globalErrorHandler';

// Report an error manually
try {
  riskyOperation();
} catch (error) {
  globalErrorHandler.reportError(
    error,
    'User profile update',
    'high'
  );
}

// Report a custom message
globalErrorHandler.reportMessage(
  'Payment processing failed',
  'checkout-flow',
  'critical'
);
```

### Using Error Boundary

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      fallback={<CustomErrorFallback />}
      onError={(error, errorInfo) => {
        // Custom error handling
        console.log('Component error caught:', error);
      }}
    >
      <YourAppComponents />
    </ErrorBoundary>
  );
}
```

### Development Testing

In development builds, use the Error Debug Panel:

```tsx
import ErrorDebugPanel from '@/components/ErrorDebugPanel';

// Add to your profile screen or any development screen
function ProfileScreen() {
  return (
    <View>
      {/* Your profile content */}
      <ErrorDebugPanel /> {/* Only visible in __DEV__ */}
    </View>
  );
}
```

## 🔍 Debugging & Monitoring

### Error Statistics

Access error statistics for monitoring:

```typescript
import errorLogger from '@/services/errorLogger';

const stats = errorLogger.getErrorStats();
console.log('Total errors:', stats.totalErrors);
console.log('Critical errors:', stats.bySeverity.critical);
console.log('Recent errors:', stats.recentErrors);
```

### Development Console

All errors are logged to console with formatted output:
- 🔴 **CRITICAL** - Red, requires immediate attention
- 🟠 **HIGH** - Orange, important issues
- 🟡 **MEDIUM** - Yellow, monitor closely
- ⚪ **LOW** - Gray, informational

### Production Monitoring

The system is designed to integrate with external monitoring services:

```typescript
// Future integration example
errorLogger.onError((errorInfo) => {
  // Send to Sentry, Bugsnag, or custom service
  ExternalErrorService.report(errorInfo);
});
```

## ✅ Best Practices

1. **Use Error Boundaries** around major UI sections
2. **Catch and report errors** in async operations
3. **Provide fallback UI** for error states
4. **Test error scenarios** in development
5. **Monitor error trends** in production
6. **Keep error messages** user-friendly
7. **Include context** in error reports

## 🚫 Common Issues & Solutions

### Issue: Too Many Console Errors
**Solution**: The console.error override has been tuned to ignore common React Native warnings. If you see excessive logging, check the filter list in `globalErrorHandler.ts`.

### Issue: Error Boundary Not Catching Errors
**Solution**: Error boundaries only catch errors in render methods and lifecycle methods. Use try-catch for async operations and event handlers.

### Issue: App Crashes Despite Error Handling
**Solution**: Some native crashes can't be caught by JavaScript error handlers. These require native debugging tools.

## 📱 Platform-Specific Notes

### iOS
- Error handler initialization delayed until after font loading
- RTL setup simplified to prevent reload loops
- Console.error filtering tuned for iOS warnings

### Android
- Native module errors may require additional handling
- Edge-to-edge layout considerations for error UI
- Different permission handling for error reporting

## 🔄 Future Improvements

- [ ] Integration with external monitoring services
- [ ] Automatic error grouping and deduplication  
- [ ] User feedback collection on errors
- [ ] Crash-free session tracking
- [ ] Performance impact monitoring
- [ ] Automated error trend analysis

## 📞 Support

For questions about the error handling system:
1. Check the console logs in development
2. Use the Error Debug Panel for testing
3. Review error statistics for patterns
4. Contact the development team for persistent issues

---

**Last Updated**: January 2025  
**Compatible With**: Expo SDK 53+, React Native 0.79+ 