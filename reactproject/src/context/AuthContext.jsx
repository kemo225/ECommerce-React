import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerAuthHandlers } from '../api/axios';
import { authService } from '../services/auth.service';
import { AuthContext } from './authContext';
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveAuthSession,
} from '../utils/authStorage';

const hasActiveSession = () => Boolean(getAccessToken() && getRefreshToken());

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasActiveSession());
  const [user, setUser] = useState(() => (hasActiveSession() ? getStoredUser() : null));
  const sessionToastShownRef = useRef(false);

  const login = useCallback(({ accessToken, refreshToken, user: nextUser, rememberMe = true }) => {
    saveAuthSession({
      accessToken,
      refreshToken,
      user: nextUser,
      rememberMe,
    });
    setUser(nextUser ?? null);
    setIsAuthenticated(true);
    sessionToastShownRef.current = false;
  }, []);

  const clearSession = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const logout = useCallback(
    async ({ silent = false, redirectTo = '/login' } = {}) => {
      const refreshToken = getRefreshToken();

      try {
        if (refreshToken) {
          await authService.logout({ refreshToken });
        }
      } catch (error) {
        if (!silent) {
          toast.error(error.message || 'Unable to logout from server.');
        }
      } finally {
        clearSession();
        if (!silent) {
          toast.success('You have been logged out.');
        }
        navigate(redirectTo, { replace: true });
      }
    },
    [clearSession, navigate]
  );

  useEffect(() => {
    registerAuthHandlers({
      onTokenRefreshed: () => {
        setIsAuthenticated(hasActiveSession());
      },
      onUnauthenticated: () => {
        clearSession();
        if (!sessionToastShownRef.current) {
          toast.error('Your session has expired. Please login again.');
          sessionToastShownRef.current = true;
        }
        navigate('/login', { replace: true });
      },
    });

    return () => {
      registerAuthHandlers({});
    };
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
    }),
    [user, login, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
