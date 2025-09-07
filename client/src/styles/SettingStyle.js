import { Platform, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 15 : 40,
    paddingBottom: 10,
    backgroundColor: Colors.primary,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.black,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 15,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 10,
  },
  listItemIcon: {
    marginRight: 15,
    tintColor: '#555',
  },
});
