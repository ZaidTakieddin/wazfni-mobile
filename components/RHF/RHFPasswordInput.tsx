import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

import { Controller } from "react-hook-form";
import {
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type Props<F extends FieldValues> = TextInputProps & {
  name: Path<F>;
  control: Control<F>;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
};

function RHFPasswordInput<F extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  multiline,
  ...other
}: Props<F>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View style={styles.fieldContainer}>
          {label && <Text style={styles.fieldLabel}>{label}</Text>}
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#8DA0BC"
            />
          </TouchableOpacity>
          <View style={[styles.inputField, multiline && styles.textAreaField]}>
            <TextInput
              {...field}
              value={field.value}
              onChangeText={field.onChange}
              textAlign="right"
              placeholder={placeholder}
              placeholderTextColor="#8DA0BC"
              style={[styles.input, multiline && styles.textAreaInput]}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              {...other}
            />
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

export default RHFPasswordInput;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 12,
    backgroundColor: Colors.white,
    minHeight: 50,
  },
  textAreaField: {
    minHeight: 120,
  },
  input: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    padding: 16,
    textAlign: "right",
  },
  textAreaInput: {
    textAlignVertical: "top",
  },
  eyeIcon: {
    padding: 12,
    position: "absolute",
    left: I18nManager.isRTL ? "auto" : 0,
    right: I18nManager.isRTL ? 0 : "auto",
    top: Platform.OS === "android" ? 37 : 27,
    zIndex: 1,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontFamily: "RZ-Reg",
    textAlign: "right",
    marginTop: 8,
  },
});
