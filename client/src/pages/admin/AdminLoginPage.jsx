import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const { adminLogin, isAdminAuthenticated } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated as admin, jump to dashboard
  if (isAdminAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide admin credentials', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        showToast('Administrative authorization granted ✓', 'success');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid administrative credentials', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@grocery.com');
    setPassword('admin123');
    showToast('Demo admin credentials filled!', 'info');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 selection:bg-emerald-500 selection:text-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-zinc-100 space-y-6">
        {/* Back to Storefront Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Grocery Storefront</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-zinc-950 mx-auto flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Shield className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h2>
          <p className="text-xs text-zinc-400">Restricted administrative access only</p>
        </div>

        {/* Demo Admin Helper */}
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-emerald-300">Seed Admin Account</p>
            <p className="text-[11px] text-zinc-400">admin@grocery.com / admin123</p>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-bold text-[11px] transition-colors"
          >
            Auto Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@grocery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Security Key / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Authorizing...</span>
              </div>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-zinc-400 border-t border-zinc-800">
          Admin sessions are monitored and cryptographically verified.
        </div>
      </div>
    </div>
  );
};
