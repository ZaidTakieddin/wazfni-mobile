import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

const MockStatusBar = ({ backgroundColor }: { backgroundColor?: string }) => {
  return (
    <View style={[styles.mockStatusBar, { backgroundColor }]}>
      {/* <Text style={styles.timeText}>9:41</Text>
      <View style={styles.statusIcons}>
        <Ionicons name="cellular-outline" size={16} color="#000" />
        <Ionicons name="wifi" size={16} color="#000" style={{ marginLeft: 4 }} />
        <Ionicons name="battery-full" size={20} color="#000" style={{ marginLeft: 4 }} />
      </View> */}
    </View>
  );
};

export default MockStatusBar;

const styles = StyleSheet.create({
  mockStatusBar: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'RZ-Bold',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
