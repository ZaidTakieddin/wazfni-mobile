import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function OTPScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // If pasting multiple digits
      const digits = value.split("").slice(0, 4);
      const newOtp = [...otp];
      digits.forEach((digit, idx) => {
        if (idx + index < 4) {
          newOtp[idx + index] = digit;
        }
      });
      setOtp(newOtp);
      // Move focus to appropriate input
      const nextIndex = Math.min(index + digits.length, 3);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        // Move to next input
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === 4) {
      // Handle verification
      // Navigate to next screen or handle verification logic
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Image source={require("@/assets/images/background.png")} style={styles.backgroundImage} />
        <Image source={require("@/assets/images/wazfni.png")} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.title}>رمز التأكيد</Text>
            <Text style={styles.subtitle}>
              من فضلك أدخل رمز التحقق الذي أرسلناه إلى بريدك الإلكتروني الآن
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.inputContainer}>
                  <TextInput
                    ref={(ref) => {
                      if (ref) {
                        inputRefs.current[index] = ref;
                      }
                    }}
                    style={styles.input}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    autoComplete="off"
                    selectionColor="#004AAD"
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, !otp.every(Boolean) && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              disabled={!otp.every(Boolean)}
            >
              <Text style={styles.verifyButtonText}>تأكيد</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  logo: {
    width: 250,
    height: 150,
    alignSelf: "center",
    verticalAlign: "top",
    marginTop: 40,
  },
  header: {
    height: 200,
    backgroundColor: "#004AAD",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "RZ-Bold",
    marginBottom: 40,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
  },
  title: {
    fontSize: 20,
    color: "#004AAD",
    textAlign: "center",
    fontFamily: "RZ-Bold",
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#004AAD",
    textAlign: "center",
    fontFamily: "RZ-Reg",
    marginBottom: 32,
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  inputContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 32,
    textAlign: "center",
    color: "#666666",
    fontFamily: "RZ-Bold",
    textAlignVertical: "center",
  },
  verifyButton: {
    backgroundColor: "#004AAD",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "RZ-Reg",
  },
});
