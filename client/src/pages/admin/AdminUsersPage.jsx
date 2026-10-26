import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Eye, ShoppingBag } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/api';

export const AdminUsersPage = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // User Orders Drawer/Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('limit', '50');

      const res = await adminApi.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async (userId, currentStatus, name) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${name}'s account?`)) return;

    try {
      const res = await adminApi.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setUsers(users.map((u) => (u._id === userId ? { ...u, isActive: res.data.isActive } : u)));
      }
    } catch (err) {
      showToast('Failed to change user status', 'error');
    }
  };

  const handleViewOrders = async (user) => {
    setSelectedUser(user);
    setIsOrdersModalOpen(true);
    setLoadingOrders(true);

    try {
      const res = await adminApi.get(`/admin/users/${user._id}/orders`);
      if (res.data.success) {
        setUserOrders(res.data.orders);
      }
    } catch (err) {
      showToast('Failed to fetch customer orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Customer Accounts</h2>
          <p className="text-xs text-zinc-500 mt-1">View shopper profiles, order frequency, total spent, and manage account statuses</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">{u.name}</p>
                          <p className="text-[10px] text-zinc-400">ID: {u._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-zinc-900 font-medium">{u.email}</p>
                      <p className="text-[10px] text-zinc-400">{u.phone || 'No phone'}</p>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewOrders(u)}
                        className="font-bold text-emerald-700 hover:underline"
                      >
                        {u.orderCount || 0} orders
                      </button>
                    </td>

                    <td className="py-3 px-4 font-bold text-zinc-900">
                      ₹{u.totalSpent || 0}
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewOrders(u)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="View Orders"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u._id, u.isActive, u.name)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.isActive
                              ? 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders Modal */}
      <Modal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        title={selectedUser ? `${selectedUser.name}'s Orders` : 'Orders'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-8 text-center text-xs text-zinc-400">Loading customer orders...</div>
          ) : userOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">This customer has not placed any orders yet.</div>
          ) : (
            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
              {userOrders.map((order) => (
                <div key={order._id} className="p-4 bg-white flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-zinc-900">#{order.orderNumber}</span>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <p className="text-zinc-500">
                      {order.items.length} items • ₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400">
                    {order.paymentMethod}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
