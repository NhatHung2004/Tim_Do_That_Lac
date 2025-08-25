import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../../constants/colors';

const GroupChatScreen = ({ route }) => {
  const { roomName, username } = route.params; // Lấy roomName và username từ navigation params
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const ws = useRef(null); // Sử dụng useRef để giữ tham chiếu đến WebSocket

  useEffect(() => {
    // Địa chỉ WebSocket của Django Channels.
    // Dùng địa chỉ IP thực của máy tính/server Django nếu chạy trên thiết bị thật,
    // không dùng 'localhost' hoặc '127.0.0.1' trừ khi dùng emulator/simulator cùng máy.
    // Ví dụ: const websocketUrl = `ws://YOUR_DJANGO_SERVER_IP:8000/ws/chat/${roomName}/`;
    const websocketUrl = `ws://192.168.1.10:8000/ws/chat/${roomName}/`;

    ws.current = new WebSocket(websocketUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      setMessages(prev => [...prev, { text: 'Kết nối chat thành công!', user: 'System' }]);
    };

    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
      console.log('Message received:', data);
      setMessages(prev => [...prev, { text: data.message, user: data.user }]);
    };

    ws.current.onerror = e => {
      console.error('WebSocket error:', e.message);
      setMessages(prev => [...prev, { text: `Lỗi kết nối: ${e.message}`, user: 'System' }]);
    };

    ws.current.onclose = e => {
      console.log('WebSocket connection closed:', e.code, e.reason);
      setMessages(prev => [...prev, { text: 'Kết nối chat đã đóng.', user: 'System' }]);
    };

    // Đóng WebSocket khi component unmount
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
        console.log('WebSocket connection closed on unmount');
      }
    };
  }, [roomName]); // Dependency: roomName

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
      const messageData = {
        message: inputMessage.trim(),
        user: username || 'React Native User',
      };
      ws.current.send(JSON.stringify(messageData));
      setInputMessage('');
    } else {
      console.warn('WebSocket not open or message is empty.');
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.user === username ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageUser}>{item.user}:</Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >
      <Text style={styles.roomTitle}>Phòng: {roomName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        inverted={false} // Hiển thị tin nhắn mới nhất ở dưới cùng
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={Colors.textGray}
        />
        <Button title="Gửi" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageUser: {
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#555',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
});

export default GroupChatScreen;
