import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/user/HomePage';
import { ProductsPage } from './pages/user/ProductsPage';
import { ProductDetailPage } from './pages/user/ProductDetailPage';
import { CartPage } from './pages/user/CartPage';
import { CheckoutPage } from './pages/user/CheckoutPage';
import { OrdersPage } from './pages/user/OrdersPage';
import { OrderDetailPage } from './pages/user/OrderDetailPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { LoginPage } from './pages/user/LoginPage';
import { RegisterPage } from './pages/user/RegisterPage';
import { ForgotPasswordPage } from './pages/user/ForgotPasswordPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Customer Protected Route Guard
const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

// 404 Page
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div className="w-16 h-16 rounded-3xl bg-zinc-100 text-zinc-400 flex items-center justify-center font-extrabold text-xl mb-4">
      404
    </div>
    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Page Not Found</h2>
    <p className="text-xs text-zinc-500 mb-6 max-w-sm">
      The grocery page you requested does not exist or has been relocated.
    </p>
    <a
      href="/"
      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
    >
      Return to Storefront
    </a>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <Routes>
                {/* 1. SEPARATE ADMIN AUTHENTICATION */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* 2. PROTECTED ADMIN PORTAL */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* 3. CUSTOMER APPLICATION & STOREFRONT */}
                <Route element={<UserLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* Customer Authentication */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Customer Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedUserRoute>
                        <CheckoutPage />
                      </ProtectedUserRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedUserRoute>
                        <OrdersPage />
                      </ProtectedUserRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedUserRoute>
                        <OrderDetailPage />
                      </ProtectedUserRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedUserRoute>
                        <ProfilePage />
                      </ProtectedUserRoute>
                    }
                  />
                  <Route
                    path="/user/dashboard"
                    element={
                      <ProtectedUserRoute>
                        <UserDashboardPage />
                      </ProtectedUserRoute>
                    }
                  />

                  {/* Catch-all 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
