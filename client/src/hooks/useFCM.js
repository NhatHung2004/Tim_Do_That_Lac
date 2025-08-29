import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import Api, { endpoints } from '../configs/Api';

export default function useFCM() {
  useEffect(() => {
    const getToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);

        // Gửi token lên server Django để lưu
        await Api.post(endpoints.save_fcm_token, { token });
      }
    };

    getToken();

    // Lắng nghe notification khi app foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('📩 Tin nhắn mới', remoteMessage.notification?.body);
    });

    return unsubscribe;
  }, []);
}
