import React, { useState, useEffect } from 'react';
import { Search, Save, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/api';

export const AdminInventoryPage = () => {
  const { showToast } = useToast();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Local state for stock adjustments before save
  const [stockEdits, setStockEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filter && filter !== 'all') params.set('filter', filter);

      const res = await adminApi.get(`/admin/inventory?${params.toString()}`);
      if (res.data.success) {
        setInventory(res.data.inventory);
        // Initialize stock edits
        const edits = {};
        res.data.inventory.forEach((item) => {
          edits[item._id] = item.stock;
        });
        setStockEdits(edits);
      }
    } catch (err) {
      showToast('Failed to fetch inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchInventory, 250);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const handleStockChange = (productId, val) => {
    setStockEdits((prev) => ({
      ...prev,
      [productId]: val === '' ? '' : Math.max(0, parseInt(val, 10) || 0)
    }));
  };

  const handleSaveStock = async (productId) => {
    const newStock = stockEdits[productId];
    if (newStock === undefined || newStock === '') return;

    setSavingId(productId);
    try {
      const res = await adminApi.put(`/admin/inventory/${productId}`, {
        stock: newStock
      });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setInventory((prev) =>
          prev.map((item) => (item._id === productId ? { ...item, stock: res.data.product.stock } : item))
        );
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update stock', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Inventory & Stock Control</h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time shelf counts, automatic stock alerts, and inline batch restock</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, category, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-2 px-3 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Inventory Items</option>
          <option value="available">Available (10+)</option>
          <option value="low">Low Stock Alert (&lt; 10)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No items found matching filter.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const stockStatus = item.stock === 0 ? 'Out of Stock' : item.stock < 10 ? 'Low Stock' : 'Available';
                  const isModified = stockEdits[item._id] !== undefined && stockEdits[item._id] !== item.stock;

                  return (
                    <tr key={item._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-xl border border-zinc-100 bg-zinc-50 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-zinc-900">{item.name}</p>
                            <p className="text-[10px] text-zinc-400">{item.brand} • Unit: {item.unit}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {item.category?.name || item.categoryName}
                      </td>

                      <td className="py-3 px-4 font-semibold text-zinc-900">
                        ₹{item.discountPrice || item.price}
                      </td>

                      <td className="py-3 px-4 font-bold text-zinc-900 text-sm">
                        {item.stock} <span className="text-xs font-normal text-zinc-400">{item.unit}</span>
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={stockStatus} type="inventory" />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockEdits[item._id] !== undefined ? stockEdits[item._id] : item.stock}
                            onChange={(e) => handleStockChange(item._id, e.target.value)}
                            className="w-16 px-2 py-1 text-xs border border-zinc-300 rounded-lg text-center font-bold text-zinc-900 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={() => handleSaveStock(item._id)}
                            disabled={!isModified || savingId === item._id}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              isModified
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
