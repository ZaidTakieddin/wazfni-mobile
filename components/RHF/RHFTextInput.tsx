import { Colors } from "@/constants/Colors";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

import { Controller } from "react-hook-form";
import {
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

type Props<F extends FieldValues> = TextInputProps & {
  name: Path<F>;
  control: Control<F>;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
  description?: string;
};

function RHFTextInput<F extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  multiline,
  style,
  description,
  ...other
}: Props<F>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View style={[styles.fieldContainer, style]}>
          {label && <Text style={styles.fieldLabel}>{label}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
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

export default RHFTextInput;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    marginBottom: 8,
    flex: 1,
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  textAreaField: {
    minHeight: 120,
  },
  input: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    padding: 16,
    // textAlign: "right",
  },
  textAreaInput: {
    textAlignVertical: "top",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    marginTop: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
});
