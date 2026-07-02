import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/client';

const tokenKey = 'querystack_token';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  const loadProfile = useCallback(async () => {
    if (!localStorage.getItem(tokenKey)) {
      setUser(null);
      return null;
    }

    setProfileLoading(true);
    try {
      const profile = await authApi.profile();
      setUser(profile);
      return profile;
    } catch {
      localStorage.removeItem(tokenKey);
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile, token]);

  const login = useCallback(async (payload) => {
    const jwt = await authApi.login(payload);
    localStorage.setItem(tokenKey, jwt);
    setToken(jwt);
    return jwt;
  }, []);

  const register = useCallback(async (payload) => {
    await authApi.register(payload);
    return login(payload);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
  }, []);

  return useMemo(
    () => ({
      token,
      user,
      profileLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshProfile: loadProfile,
    }),
    [token, user, profileLoading, isAuthenticated, login, register, logout, loadProfile],
  );
}
