import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';

interface DropdownModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: string[];
  selectedValue?: string;
  title: string;
}

const { height } = Dimensions.get('window');

export default function DropdownModal({
  visible,
  onClose,
  onSelect,
  options,
  selectedValue,
  title,
}: DropdownModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>إلغاء</Text>
            </TouchableOpacity>
          </View>

          {/* Options */}
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, option === selectedValue && styles.selectedOption]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}>
                <Text
                  style={[
                    styles.optionText,
                    option === selectedValue && styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
  },
  headerTitle: {
    fontSize: 16,
    color: '#062C65',
    fontFamily: 'RZ-Bold',
  },
  closeButton: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'RZ-Reg',
  },
  optionsList: {
    padding: 16,
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
  },
  selectedOption: {
    backgroundColor: '#F5F7FA',
  },
  optionText: {
    fontSize: 14,
    color: '#062C65',
    fontFamily: 'RZ-Reg',
    textAlign: 'right',
  },
  selectedOptionText: {
    color: '#004AAD',
    fontFamily: 'RZ-Bold',
  },
});
