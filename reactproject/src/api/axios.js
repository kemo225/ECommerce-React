import axios from 'axios';
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../utils/authStorage';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://sunnytrip.runasp.net/';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: JSON_HEADERS,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: JSON_HEADERS,
});

const NON_REFRESHABLE_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/refresh',
];

let isRefreshing = false;
let failedQueue = [];
let onUnauthenticatedHandler = null;
let onTokenRefreshedHandler = null;

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(token);
  });

  failedQueue = [];
};

const isNonRefreshableRequest = (url = '') => {
  const normalizedUrl = String(url).toLowerCase();
  return NON_REFRESHABLE_ENDPOINTS.some((endpoint) => normalizedUrl.includes(endpoint));
};

const extractRefreshTokens = (payload, fallbackRefreshToken) => {
  const data = payload?.data ?? payload ?? {};

  return {
    accessToken: data?.accessToken ?? data?.token ?? data?.access_token,
    refreshToken: data?.refreshToken ?? data?.refresh_token ?? fallbackRefreshToken,
  };
};

const requestTokenRefresh = async (refreshToken) => {
  const { data } = await refreshClient.post(
    '/api/Auth/refresh',
    { refreshToken },
    { skipAuth: true }
  );
  const nextTokens = extractRefreshTokens(data, refreshToken);

  if (!nextTokens.accessToken) {
    throw new Error('Failed to refresh access token.');
  }

  setAccessToken(nextTokens.accessToken);
  setRefreshToken(nextTokens.refreshToken);

  if (typeof onTokenRefreshedHandler === 'function') {
    onTokenRefreshedHandler(nextTokens);
  }

  return nextTokens.accessToken;
};

apiClient.interceptors.request.use(
  (config) => {
    // Inject Accept-Language header
    const currentLang = localStorage.getItem('ethereal-lang') || 'en';
    config.headers = config.headers ?? {};
    config.headers['Accept-Language'] = currentLang;

    if (config.skipAuth) {
      return config;
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const refreshToken = getRefreshToken();

    // Handle global API errors for 400 and 404
    if (status === 400) {
      const errorData = error?.response?.data;
      let errorMsg = 'Bad request (400)';
      if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (errorData?.errors) {
        errorMsg = Object.values(errorData.errors).flat().join(', ');
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }
      toast.error(errorMsg);
    } else if (status === 404) {
      const errorMsg = error?.response?.data?.message || 'Resource not found (404)';
      toast.error(errorMsg);
    }

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    // Handle 401 authentication errors with token refresh mechanism
    if (originalRequest._retry || !refreshToken || isNonRefreshableRequest(originalRequest.url)) {
      clearAuthStorage();
      if (typeof onUnauthenticatedHandler === 'function') {
        onUnauthenticatedHandler();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const nextAccessToken = await requestTokenRefresh(refreshToken);
      processQueue(null, nextAccessToken);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthStorage();
      if (typeof onUnauthenticatedHandler === 'function') {
        onUnauthenticatedHandler();
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const registerAuthHandlers = ({ onUnauthenticated, onTokenRefreshed } = {}) => {
  onUnauthenticatedHandler = onUnauthenticated ?? null;
  onTokenRefreshedHandler = onTokenRefreshed ?? null;
};

export default apiClient;


