import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('grocery_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('grocery_user_token'));
  const [loading, setLoading] = useState(true);

  // Fetch latest customer profile if token exists
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('grocery_user_token');
      if (storedToken) {
        try {
          const res = await userApi.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('grocery_user_data', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Customer session invalid or expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    const res = await userApi.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('grocery_user_token', res.data.token);
      localStorage.setItem('grocery_user_data', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await userApi.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('grocery_user_token', res.data.token);
      localStorage.setItem('grocery_user_data', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await userApi.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('grocery_user_token');
      localStorage.removeItem('grocery_user_data');
    }
  };

  const updateProfile = async (formData) => {
    const res = await userApi.put('/auth/profile', formData);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('grocery_user_data', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const addAddress = async (addressData) => {
    const res = await userApi.post('/auth/address', addressData);
    if (res.data.success && user) {
      const updatedUser = { ...user, addresses: res.data.addresses };
      setUser(updatedUser);
      localStorage.setItem('grocery_user_data', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  const updateAddress = async (addressId, addressData) => {
    const res = await userApi.put(`/auth/address/${addressId}`, addressData);
    if (res.data.success && user) {
      const updatedUser = { ...user, addresses: res.data.addresses };
      setUser(updatedUser);
      localStorage.setItem('grocery_user_data', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  const deleteAddress = async (addressId) => {
    const res = await userApi.delete(`/auth/address/${addressId}`);
    if (res.data.success && user) {
      const updatedUser = { ...user, addresses: res.data.addresses };
      setUser(updatedUser);
      localStorage.setItem('grocery_user_data', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
