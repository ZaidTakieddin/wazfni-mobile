import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CityDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

const cities = ['دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماة'];

const CityDropdown: React.FC<CityDropdownProps> = ({ visible, onClose, onSelectCity }) => {
  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => {
        onSelectCity(item);
        onClose();
      }}>
      <Text style={styles.cityText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.dropdownContainer}>
          <FlatList
            data={cities}
            renderItem={renderCityItem}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: width * 0.9,
    maxHeight: height * 0.5,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cityItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cityText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'right',
  },
});

export default CityDropdown;
