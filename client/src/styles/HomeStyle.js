import { Platform, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  headerContainer: {
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
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 10 : 25,
    paddingBottom: Platform.OS === 'android' ? 10 : 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },

  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  headerTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postList: {
    paddingVertical: 10,
  },

  // FILTER
  filterContent: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingLeft: 16,
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  filterSection: {
    marginBottom: Platform.OS === 'android' ? 5 : 10,
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.link,
    marginRight: 8,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  filterDeleteButton: {
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  filterDeleteText: {
    color: Colors.link,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  filterSelectedText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  filterSelectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    borderColor: Colors.link,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginHorizontal: 5,
  },

  // ANIMATION
  animatedContainer: {
    overflow: 'hidden',
  },
});
