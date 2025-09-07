import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/components/User/Login';
import Register from './src/components/User/Register';
import HomeScreen from './src/components/Dashboard/Homea';
import ManageScreen from './src/components/Dashboard/Manage';
import PostScreen from './src/components/Dashboard/Post';
import ProfileScreen from './src/components/Dashboard/Profilea';
import Setting from './src/components/Dashboard/Setting';
import Colors from './src/constants/colors';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  MyDispatchContext,
  MyNotificationContext,
  MyRefreshContext,
  MyUserContext,
} from './src/configs/MyContext';
import { useContext, useReducer, useState } from 'react';
import MyUserReducer from './src/reducers/MyUserReducer';
import PostDetail from './src/components/Dashboard/PostDetail';
import ForgotPass from './src/components/User/ForgotPass';
import { useNavigation } from '@react-navigation/native';
import UploadPost from './src/components/Dashboard/UploadPost';
import MessagesScreen from './src/components/Message';
import ChatScreen from './src/components/Message/ChatScreen';
import GroupChatScreen from './src/components/Message/GroupChatScreen';
import { PaperProvider } from 'react-native-paper';
import CameraScreen from './src/components/SearchImage/CameraScreen';
import EditPost from './src/components/Dashboard/EditPost';
import NotificationHandler from './src/components/Notification/NotificationHandler';
import NotificationScreen from './src/components/Notification/NotificationScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const VirtualComponent = () => {
  return null;
};

const TabNavigator = () => {
  const navigation = useNavigation();
  const current_user = useContext(MyUserContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarShowLabel: true,
        headerShown: false, // Ẩn header mặc định
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: Platform.OS === 'ios' ? 85 : 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          marginBottom: Platform.OS === 'ios' ? 20 : 15,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="manage"
        component={ManageScreen}
        options={{
          title: 'Quản lý tin',
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="post"
        component={VirtualComponent}
        options={{
          title: 'Đăng tin',
          tabBarIcon: ({ size }) => (
            <View style={styles.postButtonContainer}>
              <Text>
                <Feather name="edit-2" size={size + 8} color="white" />{' '}
              </Text>
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 10,
            color: Colors.primary,
          },
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (current_user) navigation.navigate('post');
                else navigation.navigate('login', { redirectScreen: 'post' });
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
        component={ProfileScreen}
      />
      <Tab.Screen
        name="setting"
        component={Setting}
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="dashboard" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="post_detail"
        component={PostDetail}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="forgot_password"
        component={ForgotPass}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="post"
        component={PostScreen}
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="upload_post" component={UploadPost} options={{ headerShown: false }} />
      <Stack.Screen name="mess_index" component={MessagesScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="chat_screen"
        component={ChatScreen}
        options={{ headerShown: false, title: 'Trò chuyện' }}
      />
      <Stack.Screen
        name="group_chat_screen"
        component={GroupChatScreen}
        options={{ headerShown: false, title: 'Trò chuyện' }}
      />
      <Stack.Screen
        name="camera"
        component={CameraScreen}
        options={{ title: 'Tìm kiếm bằng hình ảnh' }}
      />
      <Stack.Screen
        name="edit_post"
        component={EditPost}
        options={{ title: 'Chỉnh sửa bài đăng', headerStyle: { backgroundColor: Colors.primary } }}
      />
      <Stack.Screen
        name="notification"
        component={NotificationScreen}
        options={{ title: 'Thông báo', headerStyle: { backgroundColor: Colors.primary } }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [refresh, setRefresh] = useState(false);
  const [currentNoti, setCurrentNoti] = useState(null);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <MyRefreshContext.Provider value={[refresh, setRefresh]}>
          <MyNotificationContext.Provider value={[currentNoti, setCurrentNoti]}>
            <PaperProvider>
              <NavigationContainer>
                <NotificationHandler />
                <StackNavigator />
              </NavigationContainer>
            </PaperProvider>
          </MyNotificationContext.Provider>
        </MyRefreshContext.Provider>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
}

const styles = StyleSheet.create({
  postButtonContainer: {
    backgroundColor: Colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: Colors.white,
  },
});
