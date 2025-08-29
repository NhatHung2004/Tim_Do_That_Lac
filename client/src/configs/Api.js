import axios from 'axios';
import Constants from 'expo-constants';
import { NGROK_URL } from '@env';

// 192.168.144.250
// 192.168.1.10
// const NGROK_URL = Constants.expoConfig.extra.NGROK_URL;
const BASE_URL = `${NGROK_URL}/api/`;

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
};

export const AuthApi = token => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
