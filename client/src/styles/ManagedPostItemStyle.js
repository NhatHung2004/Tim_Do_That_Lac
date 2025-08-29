import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.secondary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  postId: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#444',
  },
  alertBox: {
    backgroundColor: '#fef9c3',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 13,
    color: '#444',
  },
  imageBox: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  viewCount: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
  },
  viewText: {
    fontSize: 12,
    color: '#444',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 10,
    borderRadius: 6,
    marginLeft: 5,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconButton: {
    marginLeft: 10,
  },
});
