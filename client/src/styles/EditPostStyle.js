import { Dimensions, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const windowWidth = Dimensions.get('window').width;
const IMAGE_SIZE = (windowWidth - 48) / 2;

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  textarea: {
    height: 110,
    textAlignVertical: 'top',
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  menu: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
  },
  searchBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    height: 40,
  },
  list: {
    maxHeight: 250,
  },
  item: {
    paddingVertical: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  warning: {
    marginTop: 10,
    color: 'orange',
    textAlign: 'center',
  },

  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  subLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  emptyBox: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777',
  },
  addRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  addBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cameraBtn: {
    backgroundColor: '#e8f4ff',
    marginRight: 0,
  },
  addBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  selectedPreview: {
    marginTop: 16,
  },
  previewBox: {
    marginTop: 8,
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageTouchable: {
    width: '100%',
    height: IMAGE_SIZE,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageCoverBorder: {
    borderWidth: 2,
    borderColor: '#2b8aef',
  },
  imageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  imageLabel: {
    fontSize: 12,
    color: '#333',
  },
  imageActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    color: '#ff4d4f',
    fontWeight: '600',
  },
  imageTile: {
    width: IMAGE_SIZE,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
