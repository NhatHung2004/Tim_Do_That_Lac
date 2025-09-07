import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../constants/colors';
import { AuthApi, endpoints } from '../../configs/Api';
import { MyUserContext } from '../../configs/MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUB_NGROK_URL } from '@env';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState({});
  const flatListRef = useRef(null);
  const webSocketRef = useRef(null); // giá trị thay đổi nhưng không làm re-render
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const user = useContext(MyUserContext);

  const { other_user_id } = route.params;

  // State để lưu chiều cao bàn phím
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Khởi tạo websocket
  useEffect(() => {
    const connectWebSocKet = async () => {
      const token = await AsyncStorage.getItem('token');
      const socketUrl = `wss://${SUB_NGROK_URL}/ws/chat/${other_user_id}/?token=${token}`;

      webSocketRef.current = new WebSocket(socketUrl);

      webSocketRef.current.onopen = () => {
        console.log('WebSocket connection opened');
        setIsConnected(true);
      };

      webSocketRef.current.onmessage = event => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        setMessages(prevMessages => [...prevMessages, data]);
      };

      webSocketRef.current.onerror = error => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      webSocketRef.current.onclose = event => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
      };
    };

    connectWebSocKet();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [other_user_id]);

  // Cuộn xuống tin nhắn cuối cùng khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      // Đảm bảo FlatList đã được render để có thể cuộn
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Một chút delay để đảm bảo render xong
    }

    // Lắng nghe sự kiện bàn phím
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [messages]);

  // Lấy thông tin của otherUser
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await AuthApi(token).get(endpoints.userDetail(other_user_id));
        setOtherUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherUser();
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    webSocketRef.current.send(
      JSON.stringify({
        content: inputText.trim(), // Gửi đúng trường 'content' như backend mong đợi
      }),
    );
    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.username === user.current_user.username;

    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.message || item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.chatPartnerInfo}>
            <Image source={{ uri: otherUser.avatar }} style={styles.chatPartnerAvatar} />
            <View>
              <Text style={styles.chatPartnerName}>{otherUser.username}</Text>
              <Text style={styles.lastActive}>Truy cập 1 ngày trước</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              /* Xử lý tùy chọn khác */
            }}
          >
            <Feather name="more-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index}
          contentContainerStyle={styles.messageListContent}
        />

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={[
            styles.inputBarContainer,
            Platform.OS === 'android' && {
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
            },
          ]}
        >
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.inputBarButton}>
              <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputBarButton}>
              <Ionicons name="image-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputBarButton}>
              <Feather name="video" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={Platform.OS === 'android' && Colors.textGray}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
            />
            {inputText.trim() !== '' && (
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Ionicons name="send" size={24} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ChatScreen;
