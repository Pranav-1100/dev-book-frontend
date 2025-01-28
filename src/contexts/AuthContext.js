'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        // Store token in localStorage for API calls
        localStorage.setItem('auth_token', token);
        const userData = await authAPI.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        handleLogout();
      }
    } else {
      handleLogout();
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    Cookies.remove('auth_token');
    localStorage.removeItem('auth_token');
    router.push('/auth/login');
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const { token, user } = await authAPI.login(credentials);
      
      // Store token in both cookie and localStorage
      Cookies.set('auth_token', token, { expires: 7 }); // 7 days
      localStorage.setItem('auth_token', token);
      
      setUser(user);
      router.push('/');
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { token, user } = await authAPI.register(userData);
      
      // Store token in both cookie and localStorage
      Cookies.set('auth_token', token, { expires: 7 });
      localStorage.setItem('auth_token', token);
      
      setUser(user);
      router.push('/');
      return user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    handleLogout();
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};