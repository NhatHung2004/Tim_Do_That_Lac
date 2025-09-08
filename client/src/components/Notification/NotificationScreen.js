import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { AuthApi, endpoints } from '../../configs/Api';
import { MyUserContext } from '../../configs/MyContext';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import FormatDate from '../../utils/FormatDate';
import styles from '../../styles/NotificationStyle';

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useContext(MyUserContext);

  // fetch api notification
  const fetchNotiData = async () => {
    try {
      setLoading(true);
      const res = await AuthApi().get(endpoints.notifications(user.current_user.id));
      console.log(res.data);
      setNotifications(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotiData();
  }, []);

  const markAsRead = async id => {
    try {
      setLoading(true);
      await AuthApi().patch(endpoints.markReadNoti(id));
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.item, item.is_read ? styles.readItem : styles.unreadItem]}>
        {item.icon && <Image source={item.icon} style={styles.icon} />}
        <View style={styles.textContainer}>
          <Text style={[styles.title, !item.is_read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.desc}>{item.body}</Text>
          <Text style={styles.time}>{FormatDate(item.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {user === null ? (
        <>
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: Colors.black, fontWeight: 'bold' }}
          >
            Vui lòng đăng nhập để xem thông báo
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={{ color: Colors.white, fontSize: 16 }}>Đăng nhập</Text>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => markAsRead(item.id)} />
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}
