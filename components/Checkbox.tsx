import type React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked ? styles.checked : styles.unchecked]}
      onPress={onPress}
      activeOpacity={0.7}>
      {checked && <Ionicons name="checkmark" size={16} color="white" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#0D99FF',
    borderWidth: 0,
  },
  unchecked: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#8DA0BC',
  },
});

export default Checkbox;
