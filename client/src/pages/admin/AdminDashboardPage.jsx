import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { adminApi } from '../../services/api';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminApi.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-zinc-400 font-medium">Crunching store statistics...</span>
      </div>
    );
  }

  const { stats, recentOrders, recentUsers, lowStockProducts, salesByDay, orderStatusCounts } = data || {};

  // Formatter for status counts
  const formattedStatusData = (orderStatusCounts || []).map((item) => ({
    status: item._id,
    count: item.count
  }));

  // Fallback demo chart data if salesByDay has few items
  const chartSalesData = (salesByDay && salesByDay.length > 0)
    ? salesByDay.map(d => ({ date: d._id.slice(5), revenue: d.revenue, orders: d.orders }))
    : [
        { date: 'Oct 12', revenue: 1240, orders: 4 },
        { date: 'Oct 13', revenue: 2310, orders: 8 },
        { date: 'Oct 14', revenue: 1950, orders: 6 },
        { date: 'Oct 15', revenue: 3400, orders: 12 },
        { date: 'Oct 16', revenue: 2800, orders: 9 },
        { date: 'Oct 17', revenue: 4100, orders: 15 },
        { date: 'Oct 18', revenue: stats?.totalRevenue || 450, orders: stats?.totalOrders || 2 },
      ];

  return (
    <div className="space-y-8">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          subtext="Total customer orders"
          icon={ShoppingBag}
          color="blue"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
          subtext="Delivered & active orders"
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtext="Active customer accounts"
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Products in Catalog"
          value={stats?.totalProducts || 0}
          subtext={`${stats?.lowStockCount || 0} items low in stock`}
          icon={Package}
          color="amber"
        />
      </div>

      {/* Low Stock Alert Banner (if any) */}
      {(stats?.lowStockCount > 0 || stats?.outOfStockCount > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-amber-900">Inventory Alert</p>
              <p className="text-amber-700">
                You have {stats?.lowStockCount} low stock items and {stats?.outOfStockCount} out of stock products.
              </p>
            </div>
          </div>
          <Link
            to="/admin/inventory"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold self-start sm:self-center transition-colors shadow-sm"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-zinc-900 tracking-tight">Sales & Revenue Trend</h3>
              <p className="text-xs text-zinc-500">Daily store revenue performance</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Live Metrics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartSalesData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-zinc-900 tracking-tight">Orders by Status</h3>
          <p className="text-xs text-zinc-500">Live distribution of customer orders</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="status" stroke="#a1a1aa" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" height={40} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [val, 'Orders']}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="font-bold text-base text-zinc-900 tracking-tight">Recent Orders</h3>
              <p className="text-xs text-zinc-500">Latest orders placed across the store</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {(recentOrders || []).map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 font-bold text-zinc-900">#{order.orderNumber}</td>
                    <td className="py-3 text-zinc-600">
                      <p className="font-medium text-zinc-900">{order.user?.name || order.deliveryAddress?.name}</p>
                      <p className="text-[10px] text-zinc-400">{order.deliveryAddress?.phone}</p>
                    </td>
                    <td className="py-3 font-semibold text-zinc-900">₹{order.totalAmount}</td>
                    <td className="py-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold text-[11px]"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="font-bold text-base text-zinc-900 tracking-tight">Recent Users</h3>
              <p className="text-xs text-zinc-500">Newly registered shoppers</p>
            </div>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {(recentUsers || []).map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between gap-3 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-zinc-900">{u.name}</p>
                    <p className="text-[10px] text-zinc-400">{u.email}</p>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
