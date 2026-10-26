import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  CreditCard,
  Layers,
  BarChart2
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
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export const AdminAnalyticsPage = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.get('/admin/analytics');
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        showToast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-zinc-400 font-medium">Aggregating store metrics...</span>
      </div>
    );
  }

  const { monthlySales, ordersByStatus, categoryDistribution, paymentMethods } = data || {};

  // Formatted data for category chart
  const categoryData = (categoryDistribution || []).map((item) => ({
    name: item._id,
    products: item.count
  }));

  // Formatted data for status chart
  const statusData = (ordersByStatus || []).map((item) => ({
    status: item._id,
    orders: item.count
  }));

  // Demo trend data if empty
  const salesData = (monthlySales && monthlySales.length > 0)
    ? monthlySales.map((m) => ({ month: m._id, revenue: m.revenue, count: m.orderCount }))
    : [
        { month: 'Jun 2026', revenue: 14500, count: 48 },
        { month: 'Jul 2026', revenue: 21300, count: 72 },
        { month: 'Aug 2026', revenue: 28900, count: 95 },
        { month: 'Sep 2026', revenue: 38200, count: 120 },
        { month: 'Oct 2026', revenue: 45600, count: 154 }
      ];

  const paymentData = (paymentMethods && paymentMethods.length > 0)
    ? paymentMethods.map((p) => ({ name: p._id === 'COD' ? 'Cash on Delivery' : 'Online / UPI', value: p.count }))
    : [
        { name: 'Cash on Delivery', value: 65 },
        { name: 'Online / UPI', value: 35 }
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Sales & Analytics</h2>
        <p className="text-xs text-zinc-500 mt-1">Deep breakdown of grocery revenue, popular categories, and checkout habits</p>
      </div>

      {/* Top Chart: Revenue Over Time */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900">Revenue Growth Trend</h3>
              <p className="text-[11px] text-zinc-400">Monthly gross sales volume</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                formatter={(val) => [`₹${val}`, 'Gross Revenue']}
                contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#areaGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products per Category */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900">Products per Category</h3>
              <p className="text-[11px] text-zinc-400">Inventory depth across departments</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                <XAxis type="number" stroke="#a1a1aa" fontSize={11} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} width={90} tickLine={false} />
                <Tooltip
                  formatter={(val) => [val, 'Products']}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="products" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900">Payment Channel Distribution</h3>
              <p className="text-[11px] text-zinc-400">COD vs Online Payment preferences</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val} orders`, 'Count']}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-zinc-600">
            {paymentData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
