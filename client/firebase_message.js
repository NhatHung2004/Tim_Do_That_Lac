import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.data.title || 'Thông báo',
    body: remoteMessage.data.body || '',
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
    data: remoteMessage.data,
  });

  // Notifee background event (user presses notification)
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('Notifee background event:', type, detail);

    if (type === EventType.PRESS) {
      const post_id = detail.notification.data?.post_id;

      // lưu lại post_id để xử lý khi app mở
      if (post_id) await AsyncStorage.setItem('navigate_post_id', post_id);
    }
  });
});
