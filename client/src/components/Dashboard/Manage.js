import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ManagedPostItem from '../ui/ManagedPostItem';
import { MyUserContext } from '../../configs/MyContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthApi, endpoints } from '../../configs/Api';

const data = [
  {
    title: 'Nice Apartment',
    location: 'New York',
    description: 'A nice apartment in the heart of New York',
    date: 'Jan 2, 2024',
  },
];

export default function ManageScreen() {
  const navigation = useNavigation();
  const [dataPosts, setDataPosts] = useState([]);
  const user = useContext(MyUserContext);

  useEffect(() => {
    const fetchPostsData = async () => {
      if (user == null) return;

      try {
        const token = await AsyncStorage.getItem('token');
        const res = await AuthApi(token).get(endpoints.userPosts(user.current_user.id));
        setDataPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPostsData();
    console.log('api da call');
  }, []);

  console.log('Current User:', dataPosts);

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

          <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            {dataPosts.posts.map((item, index) => (
              <ManagedPostItem key={index} {...item} />
            ))}
          </View>
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
