import apiClient from '../api/axios';
import { extractApiErrorMessage } from '../utils/apiError';

const normalizePayload = (payload = {}) => payload?.data ?? payload ?? {};

const toNormalizedError = (error, fallbackMessage) => {
  const normalizedError = new Error(extractApiErrorMessage(error, fallbackMessage));
  normalizedError.status = error?.response?.status;
  normalizedError.details = error?.response?.data;
  return normalizedError;
};

const normalizeAuthPayload = (payload = {}) => {
  const data = normalizePayload(payload);
  const accessToken = data?.accessToken ?? data?.token ?? data?.access_token;
  const refreshToken = data?.refreshToken ?? data?.refresh_token;
  const user = data?.user ?? data?.profile ?? null;

  if (!accessToken || !refreshToken) {
    throw new Error('Invalid authentication response from the server.');
  }

  return { accessToken, refreshToken, user };
};

export const authService = {
  async login({ email, password }) {
    try {
      const { data } = await apiClient.post(
        '/api/Auth/login',
        { email, password },
        { skipAuth: true }
      );
      return normalizeAuthPayload(data);
    } catch (error) {
      throw toNormalizedError(error, 'Login failed. Please check your credentials.');
    }
  },

  async forgotPassword({ email }) {
    try {
      const { data } = await apiClient.post(
        '/api/Auth/forgot-password',
        { email },
        { skipAuth: true }
      );
      console.log('Forgot password response:', data);
      return normalizePayload(data);
    } catch (error) {
      throw toNormalizedError(error, 'Unable to process forgot password request.');
    }
  },

  async resetPassword({  token, newPassword }) {
    try {
      const { data } = await apiClient.post(
        '/api/Auth/reset-password',
        {
          token,
          newPassword
        },
        { skipAuth: true }
      );
      return normalizePayload(data);
    } catch (error) {
      console.error('Reset password error details:', error?.response?.data ?? error);
      throw toNormalizedError(error, 'Unable to reset password.');
    }
  },

  async refresh({ refreshToken }) {
    try {
      const { data } = await apiClient.post(
        '/api/Auth/refresh',
        { refreshToken },
        { skipAuth: true }
      );
      const normalized = normalizePayload(data);
      const accessToken =
        normalized?.accessToken ?? normalized?.token ?? normalized?.access_token;
      const nextRefreshToken =
        normalized?.refreshToken ?? normalized?.refresh_token ?? refreshToken;

      if (!accessToken) {
        throw new Error('Invalid refresh response from the server.');
      }

      return { accessToken, refreshToken: nextRefreshToken };
    } catch (error) {
      throw toNormalizedError(error, 'Unable to refresh session.');
    }
  },

  async logout({ refreshToken } = {}) {
    try {
      const payload = refreshToken ? { refreshToken } : {};
      const { data } = await apiClient.post('/api/Auth/logout', payload);
      return normalizePayload(data);
    } catch (error) {
      throw toNormalizedError(error, 'Unable to logout from server.');
    }
  },
};

