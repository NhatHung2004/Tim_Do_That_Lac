import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: Platform.OS === 'ios' ? 0 : 40,
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRightPlaceholder: {
    width: 24,
  },
  quickPostSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  aiPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiIconContainer: {
    backgroundColor: '#ffaa00',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  aiText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  aiButtonContent: {
    flex: 1,
  },
  aiButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  aiButtonSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  categorySection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryIcon: {
    marginRight: 15,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  highlightBadge: {
    backgroundColor: '#ff5c5c',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  highlightText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryArrow: {
    marginLeft: 10,
  },
});
