import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  onMessage,
  getInitialNotification,
  requestPermission,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { MyNotificationContext } from '../../configs/MyContext';

export default function NotificationHandler() {
  const navigation = useNavigation();
  const [setCurrentNoti] = useContext(MyNotificationContext);

  // display notifications on the application background
  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
    createChannel();
  }, []);

  // Handle navigation when user clicks background notification
  useEffect(() => {
    async function handlePendingNavigation() {
      const postId = await AsyncStorage.getItem('navigate_post_id');
      if (postId) {
        await AsyncStorage.removeItem('navigate_post_id');
        navigation.navigate('post_detail', { postID: id });
      }
    }
    handlePendingNavigation();
  }, [navigation]);

  useEffect(() => {
    const messaging = getMessaging();

    async function initFCM() {
      // Request permision to receive notifications
      if (Platform.OS === 'ios') {
        const authStatus = await requestPermission(messaging);
        console.log('iOS permission:', authStatus);
      } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('Android notification permission:', granted);
      }

      // 2. Foreground
      const unsubscribeForeground = onMessage(messaging, remoteMessage => {
        if (remoteMessage.data) {
          console.log('onMessage (Foreground):', remoteMessage.data);
          setCurrentNoti(remoteMessage.data);
        }
      });

      // 4. Quit
      const initialNotification = await getInitialNotification(messaging);
      if (initialNotification) {
        console.log('getInitialNotification (Quit):', initialNotification);
        const postId = initialNotification.data?.post_id;
        if (postId) {
          navigation.navigate('PostDetail', { id: postId });
        }
      }

      return () => {
        unsubscribeForeground();
        unsubscribeOpened();
      };
    }

    initFCM();
  }, [navigation]);

  return null;
}
