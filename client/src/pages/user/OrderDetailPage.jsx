import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Package,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { userApi } from '../../services/api';

const ORDER_STEPS = [
  { status: 'Pending', label: 'Order Placed', desc: 'Received & awaiting confirmation' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Order verified by grocery store' },
  { status: 'Preparing', label: 'Preparing', desc: 'Groceries handpicked & packed' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Delivery partner on the way' },
  { status: 'Delivered', label: 'Delivered', desc: 'Groceries received by customer' }
];

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await userApi.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 10 seconds for live updates from admin
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      const res = await userApi.put(`/orders/${id}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully', 'info');
        setOrder(res.data.order);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-400 font-medium">Tracking your order...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Order Not Found</h2>
        <p className="text-xs text-zinc-500">We could not locate this order details.</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  // Determine current timeline progress index
  const statusIndexMap = {
    Pending: 0,
    Confirmed: 1,
    Preparing: 2,
    'Out for Delivery': 3,
    Delivered: 4
  };
  const currentStepIndex = isCancelled ? -1 : (statusIndexMap[order.orderStatus] ?? 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Visual Order Timeline Tracker */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-8">
          Delivery Status Timeline
        </h3>

        {isCancelled ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>This order was cancelled. Restocked back into our inventory.</span>
          </div>
        ) : (
          <div className="relative">
            {/* Desktop Horizontal Stepper */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-2 relative">
              {/* Connecting progress line */}
              <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-zinc-200 -z-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / 4) * 100}%` }}
                />
              </div>

              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                    >
                      {isPassed ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-bold mt-2 ${isPassed ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{step.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="sm:hidden space-y-6 relative border-l-2 border-zinc-200 ml-4 pl-6">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;

                return (
                  <div key={step.status} className="relative">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-300'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <p className={`text-xs font-bold ${isPassed ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-zinc-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Delivery Info + Order Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items in Order */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider pb-3 border-b border-zinc-100">
            Items in this Delivery ({order.items.length})
          </h3>

          <div className="divide-y divide-zinc-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl border border-zinc-100 bg-zinc-50"
                  />
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-zinc-900">{item.name}</h4>
                    <p className="text-xs text-zinc-400">
                      ₹{item.price} × {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-xs sm:text-sm text-zinc-900">
                  ₹{item.subtotal || item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-zinc-900">
                {order.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-extrabold text-zinc-900">
              <span>Total Paid</span>
              <span className="text-emerald-700">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right: Delivery Address & Payment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Address Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Address</span>
            </div>
            <p className="font-semibold text-zinc-900 text-xs sm:text-sm">{order.deliveryAddress?.name}</p>
            <p className="text-xs text-zinc-600 leading-relaxed">{order.deliveryAddress?.addressLine}</p>
            <p className="text-xs text-zinc-500">
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
            </p>
            <p className="text-xs text-zinc-500 font-medium">Contact: {order.deliveryAddress?.phone}</p>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider mb-1">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payment Details</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Method</span>
              <span className="font-semibold text-zinc-900">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Payment Status</span>
              <span className={`font-semibold ${order.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.paymentDetails?.transactionId && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                <span className="text-zinc-400">Transaction ID</span>
                <span className="font-mono text-[11px] text-zinc-600">{order.paymentDetails.transactionId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
