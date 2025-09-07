import { Platform, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 35,
  },
  headerText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
