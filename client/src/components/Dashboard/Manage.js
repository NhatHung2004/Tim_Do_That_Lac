import React, { useContext, useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ManagedPostItem from '../ui/ManagedPostItem';
import { MyRefreshContext, MyUserContext } from '../../configs/MyContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthApi, endpoints } from '../../configs/Api';
import styles from '../../styles/ManageStyle';

export default function ManageScreen() {
  const navigation = useNavigation();
  const [dataPosts, setDataPosts] = useState([]);
  const user = useContext(MyUserContext);
  const [refresh, setRefresh] = useContext(MyRefreshContext);
  const [checkFetchPosts, setCheckFetchPosts] = useState(false);

  const fetchPostsData = async () => {
    if (user == null) return;

    try {
      const res = await AuthApi().get(endpoints.userPosts(user.current_user.id));
      setDataPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useFocusEffect(() => {
    dataPosts.map(p => {
      if (p.status !== 'processing') {
        setRefresh(true);
        return;
      }
    });
  });

  const handleDeleted = post_id => {
    setDataPosts(prev => prev.filter(p => p.id !== post_id));
    setRefresh(true);
  };

  // Fetch posts when status post changes
  useEffect(() => {
    fetchPostsData();
    setCheckFetchPosts(false);
  }, [checkFetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPostsData();
    }, [user]),
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
            renderItem={({ item }) => (
              <ManagedPostItem {...item} onDeleted={handleDeleted} checked={setCheckFetchPosts} />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}
