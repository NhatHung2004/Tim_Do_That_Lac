import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';

export default function SectionItem({ title, children, onPress }) {
  return (
    <>
      <TouchableOpacity style={styles.listItem} onPress={onPress}>
        {children}
        <Text style={styles.listItemText}>{title}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  listItemText: {
    flex: 1, // Để chữ chiếm hết không gian còn lại
    fontSize: 16,
    color: '#333',
  },
});
