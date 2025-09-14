import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/`;
const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
    'X-CLIENT': 'Web',
  },
  withCredentials: true,
});

export const endpoints = {
  login: '/token/',
  refresh: '/token/refresh/',
  posts: '/admin/posts/',
  postDetail: (post_id) => `/admin/posts/${post_id}/`,
  approve: (post_id) => `/admin/posts/${post_id}/approve/`,
  reject: (post_id) => `/admin/posts/${post_id}/reject/`,
  statsSummary: '/stats/summary/',
  stats_posts_by_month: '/stats/posts_by_month/',
};

let isRefreshing = false;
let refreshSubscribers = [];

export const AuthApi = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Add interceptor to automatically add token to header
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Handle request error 401
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(`${BASE_URL}token/refresh/`, {}, { withCredentials: true });

          const newToken = res.data.access;
          localStorage.setItem('token', newToken);

          instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          refreshSubscribers.forEach((cb) => cb(newToken));
          refreshSubscribers = [];

          return instance(originalRequest);
        } catch (err) {
          localStorage.clear();
          console.log(err);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default Api;
