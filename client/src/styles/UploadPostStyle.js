import { Platform, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },

  scrollViewContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },

  // IMAGE UPLOAD
  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
    marginBottom: 15,
    position: 'relative',
  },
  imageUploadHint: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUploadHintText: {
    color: Colors.link,
    fontSize: 12,
    marginLeft: 3,
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginTop: 10,
  },
  addImageButton: {
    width: 130,
    height: 130,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderStyle: 'dashed',
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 130,
    height: 130,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ADDRESS INPUT
  inputLabel: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
  },
  requiredStar: {
    color: 'red',
  },

  // VIDEO UPLOAD
  videoUploadBox: {
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
    marginBottom: 20,
    position: 'relative',
  },
  videoUploadHint: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoUploadHintText: {
    color: '#007bff',
    fontSize: 12,
    marginLeft: 3,
  },
  videoUploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginTop: 10,
  },
  videoUploadSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
    marginBottom: Platform.OS === 'ios' ? 5 : 0,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.textDark,
    backgroundColor: Colors.white,
  },
  descriptionInput: {
    height: 120,
    paddingTop: 10,
  },

  // BUTON ĐĂNG TIN
  footerButtons: {
    flexDirection: 'row',
    paddingLeft: 13,
    paddingRight: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f0f2f5',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 15 : 10,
  },
  postButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  addressSelectionArea: {
    // Vùng chứa các input chọn địa chỉ trong modal
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addressSelectorInput: {
    // Input dùng để mở modal chọn tỉnh/huyện/xã
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  specificAddressTextInput: {
    // Text input cho địa chỉ cụ thể
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  completeButton: {
    // Nút "HOÀN THÀNH" của modal chính
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
  },

  // Nested Modal (Province/District/Ward List)
  nestedModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  nestedModalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  nestedModalHeader: {
    // Header mới cho nested modal
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Điều chỉnh padding top
  },
  nestedModalHeaderLeft: {
    // Để icon X sát bên trái
    paddingRight: 15,
  },
  nestedModalHeaderRight: {
    // Để nút/icon "Tìm kiếm" ở bên phải
    width: 24,
  },
  searchBox: {
    // Style cho ô tìm kiếm
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25, // Bo tròn góc
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 15,
    backgroundColor: Colors.white,
  },
  searchInput: {
    flex: 1,
    height: 40, // Chiều cao của input
    fontSize: 16,
    color: Colors.textDark,
    marginLeft: 10,
  },
  // Mỗi item trong FlatList của nested modal
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  addressItemText: {
    fontSize: 16,
    color: Colors.textDark,
  },

  tagItem: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  tagText: {
    marginRight: 5,
    flexShrink: 1,
  },
  popularTagItem: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },

  // Menu button styles
  menuButton: {
    width: '100%',
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  menuButtonContent: {
    flexDirection: 'row-reverse',
  },
  menuButtonLabel: {
    textAlign: 'left',
    flex: 1,
    color: Colors.textDark,
  },
});
