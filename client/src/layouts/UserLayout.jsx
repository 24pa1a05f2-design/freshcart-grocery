import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
