import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import client, { getStoredToken, setStoredToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    setToken(t);
    try {
      const { data } = await client.get('/users/me');
      setUser(data.user);
    } catch {
      setStoredToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const on401 = () => {
      setUser(null);
      setToken(null);
      navigate('/login', { replace: true });
    };
    window.addEventListener('finsmart:unauthorized', on401);
    return () => window.removeEventListener('finsmart:unauthorized', on401);
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success('Welcome back.');
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await client.post('/auth/register', { name, email, password });
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success('Account created.');
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
    toast.success('Signed out.');
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await client.get('/users/me');
      setUser(data.user);
      return data.user;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: Boolean(token && user),
      onboardingComplete: Boolean(user?.onboardingCompletedAt),
    }),
    [user, token, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
