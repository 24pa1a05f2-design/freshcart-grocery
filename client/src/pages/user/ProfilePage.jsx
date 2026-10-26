import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  LogOut,
  Package,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';

export const ProfilePage = () => {
  const { user, isAuthenticated, updateProfile, changePassword, addAddress, deleteAddress, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  if (!isAuthenticated) {
    navigate('/login?redirect=/profile');
    return null;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name, phone });
      showToast('Profile updated successfully ✓', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      showToast('Password updated successfully ✓', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      showToast('Address added ✓', 'success');
      setShowAddressModal(false);
      setNewAddress({
        name: user?.name || '',
        phone: user?.phone || '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      await deleteAddress(addressId);
      showToast('Address removed', 'info');
    } catch (err) {
      showToast('Failed to remove address', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-emerald-200">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">{user?.name}</h1>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4 text-zinc-500" />
            <span>My Orders</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal info & Password */}
        <div className="lg:col-span-6 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-100">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 text-xs bg-zinc-100 text-zinc-400 border border-zinc-200 rounded-xl cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Security & Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Manage Delivery Addresses */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Saved Delivery Addresses</span>
            </h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {(user?.addresses || []).length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl text-xs text-zinc-400 space-y-2">
              <p>No delivery addresses saved.</p>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-emerald-600 font-semibold underline"
              >
                Add one now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-50 flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 text-sm">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600">{addr.addressLine}</p>
                    <p className="text-zinc-500">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-zinc-500">Phone: {addr.phone}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Add New Address"
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Address Line</label>
            <input
              type="text"
              required
              value={newAddress.addressLine}
              onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
              className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">City</label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">State</label>
              <input
                type="text"
                required
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Pincode</label>
              <input
                type="text"
                required
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
