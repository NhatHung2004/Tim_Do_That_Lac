import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `${NGROK_URL}/api/`;
const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CLIENT': 'Mobile',
  },
});

export const endpoints = {
  login: '/token/',
  google: '/token/google/',
  register: '/users/',
  posts: '/posts/',
  postDetail: id => `/posts/${id}/`,
  userDetail: user_id => `/users/${user_id}`,
  userPosts: user_id => `/users/${user_id}/posts/`,
  batchPosts: 'posts/batch/',
  chatrooms: '/chatrooms/',
  tags: '/tags/',
  categories: '/categories/',
  search_image: '/postimages/search-image/',
  detelePostImage: image_id => `/postimages/${image_id}/`,
  fcmToken: '/fcm_token/',
  notifications: user_id => `/users/${user_id}/notifications/`,
  markReadNoti: noti_id => `/notifications/${noti_id}/mark_read/`,
};

export const AuthApi = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'X-CLIENT': 'Mobile',
    },
  });

  instance.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      if (error.response && error.response.status === 401) {
        // Handling expired or invalid tokens
        await AsyncStorage.removeItem('token');
        const refresh = await AsyncStorage.getItem('refresh');

        if (refresh) {
          try {
            const res = await axios.post(`${BASE_URL}token/refresh/`, {
              refresh: refresh,
            });
            const newToken = res.data.access;
            await AsyncStorage.setItem('token', newToken);

            // Retry the original request with the new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return instance.request(error.config);
          } catch (refreshError) {
            // If refresh also fails, logout the user
            await AsyncStorage.removeItem('refresh');
            console.log(refreshError);
          }
        }
      }
    },
  );

  return instance;
};

export default Api;
