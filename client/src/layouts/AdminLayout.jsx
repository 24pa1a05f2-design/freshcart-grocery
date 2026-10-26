import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout = () => {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-400 font-medium">Verifying Administrative Privileges...</span>
        </div>
      </div>
    );
  }

  // Strict Protection: Unauthorized users cannot view admin layout
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/products')) return 'Product Management';
    if (pathname.includes('/admin/categories')) return 'Category Management';
    if (pathname.includes('/admin/orders')) return 'Order Management';
    if (pathname.includes('/admin/users')) return 'Customer Accounts';
    if (pathname.includes('/admin/inventory')) return 'Inventory & Stock Control';
    if (pathname.includes('/admin/analytics')) return 'Sales & Performance Analytics';
    if (pathname.includes('/admin/settings')) return 'Store Settings';
    return 'Dashboard Overview';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen flex bg-zinc-50 font-sans text-zinc-900">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar setMobileOpen={setMobileOpen} pageTitle={pageTitle} />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
