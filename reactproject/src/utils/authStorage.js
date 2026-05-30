const STORAGE_KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  user: 'auth.user',
  rememberMe: 'auth.rememberMe',
};

const safeParseJSON = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.accessToken);

export const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.refreshToken);

export const getStoredUser = () => safeParseJSON(localStorage.getItem(STORAGE_KEYS.user));

export const saveAuthSession = ({ accessToken, refreshToken, user, rememberMe }) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  }

  if (user !== undefined) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }

  localStorage.setItem(STORAGE_KEYS.rememberMe, JSON.stringify(Boolean(rememberMe)));
};

export const setAccessToken = (accessToken) => {
  if (!accessToken) {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
};

export const setRefreshToken = (refreshToken) => {
  if (!refreshToken) {
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
};

export const clearAuthStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

