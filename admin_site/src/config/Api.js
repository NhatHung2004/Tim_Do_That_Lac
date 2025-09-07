import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/`;
const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
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
};

export const AuthApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
    },
  });
};

export default Api;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return Api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // gọi API refresh
        const { data } = await Api.post(endpoints.refresh, {});
        const newToken = data.access;

        // lưu lại access token
        localStorage.setItem('accessToken', newToken);

        Api.defaults.headers.Authorization = 'Bearer ' + newToken;
        processQueue(null, newToken);

        return Api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
