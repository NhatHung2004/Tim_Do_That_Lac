import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';

export default function SectionContainer({ title, children }) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#777',
    paddingBottom: 10,
    paddingLeft: 15,
    backgroundColor: '#F2F2F2', // Màu nền của tiêu đề mục
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginBottom: 10,
  },
});
