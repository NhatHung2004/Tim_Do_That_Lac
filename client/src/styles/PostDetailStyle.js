import { Dimensions, StyleSheet, Platform, StatusBar } from 'react-native';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: 80,
    marginTop: Platform.OS === 'ios' ? -25 : 25,
  },
  // --- Header Styles ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightGray,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.primary,
  },
  iconButton: {
    padding: 5,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  // --- ProductImageCarousel Styles ---
  carouselContainer: {
    width: '100%',
    height: width * 0.9,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  productImage: {
    width: width,
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  paginationText: {
    color: Colors.white,
    fontSize: 12,
  },
  // --- Product Details Section Styles ---
  detailsSection: {
    backgroundColor: Colors.white,
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.textDark,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  postedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPostedTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  // --- SellerInfo Styles ---
  sellerContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  activeStatus: {
    fontSize: 12,
    color: 'gray',
  },
  sellerBagIcon: {
    padding: 5,
  },
  // --- Description Section Styles ---
  descriptionSection: {
    backgroundColor: Colors.white,
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textDark,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  // --- Footer Styles ---
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  callButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.link,
    borderWidth: 1,
  },
  callButtonText: {
    color: Colors.link,
  },
  chatButton: {
    backgroundColor: Colors.link,
    borderColor: Colors.link,
    borderWidth: 1,
  },
  chatButtonText: {
    color: Colors.white,
  },
  // --- Comment Styles ---
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  scrollArea: { maxHeight: 300 }, // Giới hạn chiều cao danh sách để scroll
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 14,
  },
  commentContainer: { flexDirection: 'row', marginBottom: 12 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  commentBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 8,
  },
  userName: { fontWeight: 'bold', marginBottom: 2 },
  commentText: { fontSize: 14, marginBottom: 4 },
  footerComment: { flexDirection: 'row', justifyContent: 'space-between' },
  reply: { fontSize: 12, color: '#007AFF' },
  time: { fontSize: 12, color: '#666' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 6,
  },
  inputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#004D40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  send: {
    marginLeft: 8,
    fontSize: 18,
    color: '#007AFF',
  },
});
