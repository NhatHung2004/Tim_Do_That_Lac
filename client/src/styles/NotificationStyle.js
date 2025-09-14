import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  item: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  unreadItem: { backgroundColor: '#f0f8ff' },
  readItem: { backgroundColor: '#fff' },
  icon: { width: 40, height: 40, marginRight: 12, borderRadius: 6 },
  textContainer: { flex: 1 },
  title: { fontSize: 14, marginBottom: 4 },
  unreadTitle: { fontWeight: 'bold', color: '#000' },
  desc: { fontSize: 13, color: '#555', marginBottom: 6 },
  time: { fontSize: 12, color: '#999' },
  separator: { height: 1, backgroundColor: '#eee', marginLeft: 64 },
});
