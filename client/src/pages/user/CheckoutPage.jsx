import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  CreditCard,
  Banknote,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { userApi } from '../../services/api';

export const CheckoutPage = () => {
  const { user, isAuthenticated, addAddress } = useAuth();
  const { items, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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

  // If cart is empty, redirect back to cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // If user is not logged in, prompt to login
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">Sign in to complete your checkout</h2>
          <p className="text-xs text-zinc-500">
            Please log in with your customer account to choose your delivery address and confirm your order.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/login?redirect=/checkout"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Log In to Continue
          </Link>
          <Link
            to="/register?redirect=/checkout"
            className="px-6 py-3 rounded-xl bg-white text-zinc-800 text-xs font-semibold border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  const addresses = user?.addresses || [];
  const selectedAddress = addresses[selectedAddressIndex] || null;

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine || !newAddress.city || !newAddress.pincode) {
      showToast('Please fill all address fields', 'error');
      return;
    }

    try {
      await addAddress(newAddress);
      showToast('New address saved successfully', 'success');
      setShowAddressModal(false);
      setSelectedAddressIndex(addresses.length); // select the newly added address
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
      showToast(err.response?.data?.message || 'Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.product,
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          price: i.price,
          image: i.image
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        customerNotes
      };

      const res = await userApi.post('/orders', orderPayload);
      if (res.data.success) {
        showToast('Order placed successfully! ✓', 'success');
        clearCart();
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-zinc-500 mt-1">Complete your delivery address and payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Step 1 (Address) and Step 3 (Payment) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-base text-zinc-900">Delivery Address</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-zinc-200 rounded-xl space-y-3">
                <MapPin className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500">No delivery address saved yet.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Add Your Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all relative ${
                      selectedAddressIndex === idx
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="font-bold text-zinc-900 text-sm">{addr.name}</span>
                      {selectedAddressIndex === idx && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-zinc-600 leading-relaxed">{addr.addressLine}</p>
                    <p className="text-zinc-500 mt-1">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-zinc-500 font-medium mt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-base text-zinc-900">Select Payment Method</h3>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-zinc-900">Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">Pay with cash or UPI upon delivery</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </label>

              {/* Online Payment (Mock Gateway Simulation) */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Online'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-zinc-900">Online Payment / UPI</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">Pay seamlessly via Cards, UPI, or NetBanking</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-400">Instant Confirmation</span>
              </label>
            </div>

            {/* Optional Customer Note */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please leave with security guard, or call upon arrival"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Step 2 (Order Summary) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-base text-zinc-900">Order Summary ({items.length} items)</h3>
          </div>

          {/* Mini Items List */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-100">
            {items.map((item) => (
              <div key={item.product} className="flex items-center justify-between text-xs pt-2 first:pt-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-zinc-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-800 truncate">{item.name}</p>
                    <p className="text-zinc-400">
                      ₹{item.price} × {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-zinc-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Billing breakdown */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-200 text-xs sm:text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-zinc-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Delivery Fee
              </span>
              <span className="font-semibold text-zinc-900">
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex justify-between text-base font-extrabold text-zinc-900">
              <span>Final Total</span>
              <span className="text-emerald-700">₹{totalAmount}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !selectedAddress}
            className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isPlacingOrder ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Confirming Order...</span>
              </div>
            ) : (
              <>
                <span>Place Grocery Order (₹{totalAmount})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Add New Delivery Address"
      >
        <form onSubmit={handleSaveNewAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number *</label>
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
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Address (House No, Street, Landmark) *</label>
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
              <label className="block text-xs font-semibold text-zinc-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Pincode *</label>
              <input
                type="text"
                required
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
