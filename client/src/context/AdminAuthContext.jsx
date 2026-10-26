import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('grocery_admin_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('grocery_admin_token'));
  const [loading, setLoading] = useState(true);

  // Verify Admin Session on load
  useEffect(() => {
    const verifyAdminSession = async () => {
      const storedToken = localStorage.getItem('grocery_admin_token');
      if (storedToken) {
        try {
          const res = await adminApi.get('/admin/me');
          if (res.data.success && res.data.admin) {
            setAdmin(res.data.admin);
            localStorage.setItem('grocery_admin_data', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.warn('Admin session expired or revoked:', err.message);
          adminLogout();
        }
      }
      setLoading(false);
    };

    verifyAdminSession();
  }, []);

  const adminLogin = async (email, password) => {
    const res = await adminApi.post('/admin/login', { email, password });
    if (res.data.success) {
      setAdminToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('grocery_admin_token', res.data.token);
      localStorage.setItem('grocery_admin_data', JSON.stringify(res.data.admin));
    }
    return res.data;
  };

  const adminLogout = async () => {
    try {
      await adminApi.post('/admin/logout');
    } catch (e) {
      // ignore
    } finally {
      setAdminToken(null);
      setAdmin(null);
      localStorage.removeItem('grocery_admin_token');
      localStorage.removeItem('grocery_admin_data');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminToken,
        isAdminAuthenticated: Boolean(adminToken && admin && admin.role === 'admin'),
        loading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
