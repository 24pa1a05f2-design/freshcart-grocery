import React from 'react';
import { Menu, Bell, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminNavbar = ({ setMobileOpen, pageTitle = 'Dashboard' }) => {
  const { admin } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 h-16 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-emerald-700 hover:bg-zinc-100 border border-zinc-200 transition-colors"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline font-medium text-zinc-600">Admin Mode</span>
          <span className="font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-[11px]">
            {admin?.name?.split(' ')[0] || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};
