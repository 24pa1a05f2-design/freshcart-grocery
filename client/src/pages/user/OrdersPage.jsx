import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { userApi } from '../../services/api';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userApi.get('/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-400 font-medium">Loading your grocery orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900">No previous orders yet</h2>
          <p className="text-xs text-zinc-500">
            You haven't placed any grocery orders yet. Start exploring our organic farm selection!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
        >
          <span>Shop Groceries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Your Grocery Orders</h1>
        <p className="text-xs text-zinc-500 mt-1">Track ongoing deliveries and view past invoices</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-extrabold text-sm text-zinc-900">Order #{order.orderNumber}</span>
                  <StatusBadge status={order.orderStatus} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {orderDate}
                  </span>
                  <span>•</span>
                  <span>{totalItemsCount} items</span>
                  <span>•</span>
                  <span className="font-bold text-zinc-900">Total: ₹{order.totalAmount}</span>
                  <span>•</span>
                  <span>Payment: {order.paymentMethod} ({order.paymentStatus})</span>
                </div>

                {/* Mini preview thumbnail chips */}
                <div className="flex items-center gap-2 pt-1">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.name}
                      title={item.name}
                      className="w-8 h-8 object-cover rounded-lg border border-zinc-100 bg-zinc-50"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-[11px] text-zinc-400 font-medium pl-1">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* View Order Link */}
              <Link
                to={`/orders/${order._id}`}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 hover:border-emerald-600 bg-zinc-50 hover:bg-emerald-50 text-zinc-800 hover:text-emerald-700 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Track Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
