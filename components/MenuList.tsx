import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

interface MenuListProps {
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  visible: boolean;
  style?: any;
  setVisible: (value: boolean) => void;
}

export default function MenuList({
  options,
  selectedValue,
  onSelect,
  visible,
  style,
  setVisible,
}: MenuListProps) {
  if (!visible) return null;

  return (
    <View style={[styles.container, style]}>
      <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.optionItem, option === selectedValue && styles.selectedOption]}
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}>
            <Text
              style={[styles.optionText, option === selectedValue && styles.selectedOptionText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#B3B9C5',
    marginTop: 0,
  },
  optionsList: {
    padding: 8,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#F5F7FA',
  },
  optionText: {
    fontSize: 16,
    color: '#5E6C82',
    fontFamily: 'RZ-Reg',
    textAlign: 'right',
  },
  selectedOptionText: {
    color: '#004AAD',
    fontFamily: 'RZ-Bold',
  },
});
