import type { Control, FieldValues, Path, PathValue } from "react-hook-form";

import { Colors } from "@/constants/Colors";
import { Option } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Props<F extends FieldValues> = TextInputProps & {
  name: Path<F>;
  control: Control<F>;
  options: Option[];
  label?: string;
  placeholder?: string;
  style?: ViewStyle;
  multiple?: boolean;
  editable?: boolean;
};

function RHFDropdown<F extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  style,
  multiple,
  editable = true,
  ...other
}: Props<F>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // --- Multiple Select Logic ---
        if (multiple) {
          const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];

          const handleMultiSelect = (value: string) => {
            const newValue = selectedValues.includes(value)
              ? selectedValues.filter((v) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValue as PathValue<F, Path<F>>); // Type assertion
          };

          const displayLabel =
            selectedValues.length > 0
              ? selectedValues
                  .map((v) => options.find((opt) => opt.value === v)?.label)
                  .filter(Boolean)
                  .join("   |   ")
              : placeholder;

          return (
            <View style={[styles.fieldContainer, style]}>
              {label && <Text style={styles.fieldLabel}>{label}</Text>}
              <TouchableOpacity
                style={[styles.dropdownField, isOpen && styles.dropdownFieldActive]}
                onPress={() => setIsOpen(!isOpen)}
                disabled={!editable}
              >
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#8DA0BC" />
                <Text
                  style={[
                    styles.dropdownText,
                    selectedValues.length === 0 && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {displayLabel}
                </Text>
              </TouchableOpacity>
              {isOpen && (
                <View style={styles.dropdownList}>
                  <ScrollView nestedScrollEnabled>
                    {options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={styles.dropdownItem}
                          onPress={() => handleMultiSelect(option.value)}
                          disabled={!editable}
                        >
                          <Text
                            style={[styles.dropdownItemText, isSelected && styles.selectedItemText]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          );
        }

        // --- Single Select Logic (Original) ---
        const handleSingleSelect = (value: string) => {
          field.onChange(value as PathValue<F, Path<F>>); // Type assertion
          setIsOpen(false);
        };

        const displayLabel =
          options.find((option) => option.value === field.value)?.label || placeholder;

        return (
          <View style={[styles.fieldContainer, style]}>
            {label && <Text style={styles.fieldLabel}>{label}</Text>}
            <TouchableOpacity
              style={[styles.dropdownField, isOpen && styles.dropdownFieldActive]}
              onPress={() => setIsOpen(!isOpen)}
              disabled={!editable}
            >
              <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#8DA0BC" />
              <Text
                style={[styles.dropdownText, !field.value && styles.placeholderText]}
                numberOfLines={1}
              >
                {displayLabel}
              </Text>
            </TouchableOpacity>
            {isOpen && (
              <View style={styles.dropdownList}>
                <ScrollView nestedScrollEnabled>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => handleSingleSelect(option.value)}
                      disabled={!editable}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          field.value === option.value && styles.selectedItemText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
}

export default RHFDropdown;

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
    lineHeight: 24,
  },
  dropdownField: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.white,
    minHeight: 50,
  },
  dropdownFieldActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
    flex: 1,
  },
  placeholderText: {
    color: Colors.text.secondary,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.border.medium,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 200,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    lineHeight: 24,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  selectedItemText: {
    color: Colors.primary,
    fontFamily: "RZ-Bold",
    lineHeight: 24,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontFamily: "RZ-Reg",
    textAlign: I18nManager.isRTL ? "left" : "right",
    marginTop: 8,
  },
});
