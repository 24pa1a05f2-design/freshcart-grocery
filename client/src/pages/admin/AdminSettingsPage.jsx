import React, { useState } from 'react';
import { Settings, Save, Shield, Store, Truck, Bell } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage = () => {
  const { admin } = useAdminAuth();
  const { showToast } = useToast();

  const [storeName, setStoreName] = useState('FreshCart Grocery Delivery');
  const [supportPhone, setSupportPhone] = useState('+91 80000 12345');
  const [supportEmail, setSupportEmail] = useState('support@freshcart.com');
  const [deliveryFee, setDeliveryFee] = useState(30);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(500);
  const [isOpen, setIsOpen] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Store settings updated successfully ✓', 'success');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Store Settings & Configuration</h2>
        <p className="text-xs text-zinc-500 mt-1">Configure delivery pricing rules, contact details, and operating status</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Store className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">Store Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Currency</label>
              <input
                type="text"
                disabled
                value="INR (₹)"
                className="w-full p-2.5 text-xs bg-zinc-100 text-zinc-400 border border-zinc-200 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Support Phone</label>
              <input
                type="tel"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Truck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">Delivery Fee Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Base Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Charged on orders below the threshold</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                min="0"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Orders above this qualify for free delivery</p>
            </div>
          </div>
        </div>

        {/* Operating Status */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-zinc-900">Accepting Online Orders</h4>
              <p className="text-xs text-zinc-500">Allow customers to checkout groceries from the storefront</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Current Admin Account Card */}
        <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">{admin?.name || 'Administrator'}</p>
              <p className="text-xs text-zinc-400">{admin?.email}</p>
              <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {admin?.role || 'Admin'} Session
              </span>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
