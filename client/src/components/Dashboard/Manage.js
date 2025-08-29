import React, { useContext, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ManagedPostItem from '../ui/ManagedPostItem';
import { MyRefreshContext, MyUserContext } from '../../configs/MyContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthApi, endpoints } from '../../configs/Api';

export default function ManageScreen() {
  const navigation = useNavigation();
  const [dataPosts, setDataPosts] = useState([]);
  const user = useContext(MyUserContext);
  const [refresh, setRefresh] = useContext(MyRefreshContext);

  const fetchPostsData = async () => {
    if (user == null) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await AuthApi(token).get(endpoints.userPosts(user.current_user.id));
      setDataPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDeleted = post_id => {
    setDataPosts(prev => prev.filter(p => p.id !== post_id));
    setRefresh(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPostsData();
    }, []),
  );

  return (
    <View
      style={[styles.container, user == null && { justifyContent: 'center', alignItems: 'center' }]}
    >
      {user == null ? (
        <>
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: Colors.black, fontWeight: 'bold' }}
          >
            Vui lòng đăng nhập để quản lý bài đăng
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
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Quản lý</Text>
            <Ionicons name="add-circle-outline" size={24} color={Colors.black} />
          </View>

          <FlatList
            data={dataPosts}
            renderItem={({ item }) => <ManagedPostItem {...item} onDeleted={handleDeleted} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 35,
  },
  headerText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
