import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Clock,
  Sparkles,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { userApi, publicApi } from '../../services/api';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const [orders, setOrders] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [ordersRes, featRes] = await Promise.all([
          userApi.get('/orders'),
          publicApi.get('/products/featured')
        ]);
        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
        if (featRes.data.success) setFeatured(featRes.data.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalSpent = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Customer Dashboard</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
            Manage your grocery deliveries, track live orders, and explore fresh seasonal harvest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm"
          >
            Start Grocery Order
          </Link>
          <Link
            to="/orders"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm border border-emerald-500 transition-colors"
          >
            All Orders ({orders.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{orders.length}</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Grocery orders placed</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">₹{totalSpent}</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Lifetime groceries</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Saved Addresses</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{user?.addresses?.length || 0}</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Home & office locations</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cart Items</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{cartCount}</div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Ready for checkout</p>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h2 className="font-bold text-base text-zinc-900 tracking-tight">Recent Orders</h2>
            <p className="text-xs text-zinc-500">Track and view status of your recent grocery deliveries</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-zinc-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 space-y-2">
            <p>You haven't made any purchases yet.</p>
            <Link to="/products" className="text-emerald-600 font-semibold underline">
              Browse groceries now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900">Order #{order.orderNumber}</span>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <p className="text-xs text-zinc-500">
                    {order.items.length} items • ₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-emerald-50 hover:border-emerald-500 text-zinc-700 hover:text-emerald-700 text-xs font-semibold self-start sm:self-center transition-colors"
                >
                  Track Status
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900">Personal Profile</h4>
              <p className="text-xs text-zinc-500">Update name, phone, or password</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Manage
          </Link>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900">Delivery Addresses</h4>
              <p className="text-xs text-zinc-500">Add or edit saved delivery locations</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};
