import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Package,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/api';

const ORDER_STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrdersPage = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '50');

      const res = await adminApi.get(`/admin/orders?${params.toString()}`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await adminApi.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by store administrator`
      });

      if (res.data.success) {
        showToast(`Order status updated to ${newStatus} ✓`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Customer Grocery Orders</h2>
          <p className="text-xs text-zinc-500 mt-1">Review live delivery queues, customer addresses, and update status</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order number, customer name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Order Statuses</option>
          {ORDER_STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status & Update</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900">
                      #{order.orderNumber}
                      <p className="text-[10px] text-zinc-400 font-normal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-900">{order.deliveryAddress?.name || order.user?.name}</p>
                      <p className="text-[10px] text-zinc-400">{order.deliveryAddress?.phone}</p>
                    </td>

                    <td className="py-3 px-4 text-zinc-600">
                      <span className="font-semibold text-zinc-900">{order.items.length} items</span>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-bold text-zinc-900">
                      ₹{order.totalAmount}
                    </td>

                    <td className="py-3 px-4 text-zinc-600">
                      <span className="font-medium">{order.paymentMethod}</span>
                      <p className={`text-[10px] font-bold ${order.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          disabled={updatingId === order._id}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-emerald-500"
                        >
                          {ORDER_STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 font-semibold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedOrder ? `Order #${selectedOrder.orderNumber}` : 'Order Details'}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            {/* Header / Status Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <p className="text-zinc-500">Current Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.orderStatus} />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Update Status:</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-emerald-500"
                >
                  {ORDER_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Address Details */}
            <div className="p-4 rounded-xl border border-zinc-200 space-y-1">
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Delivery Information
              </h4>
              <p className="font-semibold text-zinc-900">{selectedOrder.deliveryAddress?.name}</p>
              <p className="text-zinc-600">{selectedOrder.deliveryAddress?.addressLine}</p>
              <p className="text-zinc-600">
                {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
              </p>
              <p className="text-zinc-600">Phone: {selectedOrder.deliveryAddress?.phone}</p>
              {selectedOrder.customerNotes && (
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2">
                  Customer Note: {selectedOrder.customerNotes}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                Ordered Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-zinc-100"
                      />
                      <div>
                        <p className="font-semibold text-zinc-900">{item.name}</p>
                        <p className="text-zinc-400">
                          ₹{item.price} × {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900">₹{item.subtotal || item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Fee</span>
                <span>₹{selectedOrder.deliveryFee}</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-zinc-900 text-sm">
                <span>Total Amount</span>
                <span className="text-emerald-700">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
