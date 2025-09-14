import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import styles from '../../styles/ChatScreenStyle';
import * as ImagePicker from 'react-native-image-picker';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState({});
  const flatListRef = useRef(null);
  const webSocketRef = useRef(null); // websocket reference
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const user = useContext(MyUserContext);
  const [image, setImage] = useState(null);

  const { other_user_id } = route.params;

  // state to track keyboard height
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Pick image from gallery
  const pickImageFromGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  // initialize WebSocket connection
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

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Ensure the FlatList has rendered the new message before scrolling
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }

    // Listen for keyboard show/hide events
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

  // Fetch other user info
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const res = await AuthApi().get(endpoints.userDetail(other_user_id));
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
        content: inputText.trim(), // send message to server
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
              <Text style={styles.chatPartnerName}>
                {otherUser.full_name || otherUser.username}
              </Text>
            </View>
          </View>
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
            {/* <TouchableOpacity style={styles.inputBarButton}>
              <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.inputBarButton}>
              <Ionicons name="image-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.inputBarButton}>
              <Feather name="video" size={24} color={Colors.primary} />
            </TouchableOpacity> */}
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

export default ChatScreen;
