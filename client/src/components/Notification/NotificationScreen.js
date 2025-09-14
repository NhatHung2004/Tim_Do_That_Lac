import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthApi, endpoints } from '../../configs/Api';
import { MyUserContext } from '../../configs/MyContext';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import FormatDate from '../../utils/FormatDate';
import styles from '../../styles/NotificationStyle';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useContext(MyUserContext);

  // Add delete all button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDeleteAll} style={{ marginRight: 15 }}>
          <Ionicons name="trash-bin-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // delete all noti
  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      await AuthApi().delete(endpoints.deleteAllNoti(user.current_user.id));
      setNotifications([]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  // fetch noti when open screen
  useEffect(() => {
    if (user) fetchNotiData();
  }, []);

  // mark as read noti when click item
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

  // delete noti item
  const deleteNoti = async id => {
    try {
      setLoading(true);
      await AuthApi().delete(endpoints.deleteNoti(id));
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // confirm delete noti
  const handleRemoveNoti = noti_id => {
    Alert.alert('Xoá thông báo', 'Bạn có muốn xoá thông báo này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deleteNoti(noti_id),
      },
    ]);
  };

  // Render notification item component
  const NotificationItem = ({ item, onPress, onDelete }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.item, item.is_read ? styles.readItem : styles.unreadItem]}>
        {item.icon && <Image source={item.icon} style={styles.icon} />}

        <View style={styles.textContainer}>
          <Text style={[styles.title, !item.is_read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.desc}>{item.body}</Text>
          {item.reason && <Text style={styles.desc}>{item.reason}</Text>}
          <Text style={styles.time}>{FormatDate(item.created_at)}</Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
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
            <NotificationItem
              item={item}
              onPress={() => markAsRead(item.id)}
              onDelete={() => handleRemoveNoti(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}
