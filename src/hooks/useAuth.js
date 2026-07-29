import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/client';
import { STORAGE_KEYS } from '../constants/storage';

export function useAuth() {
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );

  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  const loadProfile = useCallback(async () => {
    if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
      setUser(null);
      return null;
    }

    setProfileLoading(true);

    try {
      const profile = await authApi.profile();
      setUser(profile);
      return profile;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
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
    const authResponse = await authApi.login(payload);

    localStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.token);
    setToken(authResponse.token);

    return authResponse;
  }, []);

  const register = useCallback(async (payload) => {
    await authApi.register(payload);
    return login(payload);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
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
    [
      token,
      user,
      profileLoading,
      isAuthenticated,
      login,
      register,
      logout,
      loadProfile,
    ]
  );
}