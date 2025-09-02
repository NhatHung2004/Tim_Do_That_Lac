import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/`;

export const endpoints = {
  login: '/token/',
  posts: '/admin/posts/',
  postDetail: post_id => `/admin/posts/${post_id}/`,
  approve: post_id => `/admin/posts/${post_id}/approve/`,
  reject: post_id => `/admin/posts/${post_id}/reject/`,
};

export const AuthApi = token => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
});
