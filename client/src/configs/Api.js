import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `${NGROK_URL}/api/`;
const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Response interceptor: nếu 401 thì xin lại access token
Api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}token/refresh/`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccess = res.data.access;
        await AsyncStorage.setItem('token', newAccess);

        // Cập nhật header và gọi lại request cũ
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccess}`,
        };
        return Api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Logout user
        await AsyncStorage.removeItem('token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

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

export const AuthApi = token => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

export default Api;
