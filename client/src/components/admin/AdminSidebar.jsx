import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Archive,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Inventory', path: '/admin/inventory', icon: Archive },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-tight leading-none">FreshCart</h2>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">
              Admin Portal
            </span>
          </div>
        </div>
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold tracking-wider text-zinc-300 uppercase mb-2">
          Management
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Profile & Logout bottom card */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] text-zinc-400 truncate">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Admin
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
