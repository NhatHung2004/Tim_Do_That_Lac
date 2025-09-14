import { Platform, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? 25 : 60,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatPartnerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  chatPartnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.gray,
  },
  chatPartnerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.black,
  },
  lastActive: {
    fontSize: 12,
    color: '#555',
  },
  messageListContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f2f5',
  },
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: '75%',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
  },
  otherMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  inputBarContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: Platform.OS === 'ios' && 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  inputBarButton: {
    padding: 5,
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
});
