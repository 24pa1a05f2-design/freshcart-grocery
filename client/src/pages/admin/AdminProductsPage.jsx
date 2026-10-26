import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Check,
  X,
  Package,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { adminApi, publicApi } from '../../services/api';

export const AdminProductsPage = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    name: '',
    description: '',
    category: '',
    brand: 'FreshFarm',
    price: '',
    discountPrice: '',
    stock: 20,
    unit: 'kg',
    image: '',
    isActive: true,
    isFeatured: false,
    isPopular: false
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCat && selectedCat !== 'all') params.set('category', selectedCat);
      if (stockFilter && stockFilter !== 'all') params.set('stockStatus', stockFilter);
      params.set('limit', '50');

      const res = await adminApi.get(`/admin/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      showToast('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await publicApi.get('/categories');
        if (res.data.success) setCategories(res.data.categories);
      } catch (e) {
        // ignore
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCat, stockFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      category: categories[0]?._id || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category?._id || product.category,
      brand: product.brand || 'FreshFarm',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      unit: product.unit || 'kg',
      image: product.image,
      isActive: product.isActive,
      isFeatured: Boolean(product.isFeatured),
      isPopular: Boolean(product.isPopular)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price === '' || formData.stock === '' || !formData.image) {
      showToast('Please fill all required product fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        await adminApi.put(`/admin/products/${editingProduct._id}`, formData);
        showToast('Product updated successfully ✓', 'success');
      } else {
        await adminApi.post('/admin/products', formData);
        showToast('Product created successfully ✓', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await adminApi.delete(`/admin/products/${productId}`);
      showToast('Product deleted successfully ✓', 'success');
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Products Catalog</h2>
          <p className="text-xs text-zinc-500 mt-1">Manage grocery items, prices, inventory, and status</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="py-2 px-3 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="py-2 px-3 text-xs bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Stock Statuses</option>
          <option value="available">Available (10+)</option>
          <option value="low">Low Stock (&lt; 10)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const stockStatus = p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Available';

                  return (
                    <tr key={p._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-xl border border-zinc-100 bg-zinc-50 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-zinc-900">{p.name}</p>
                            <p className="text-[10px] text-zinc-400">{p.brand} • Unit: {p.unit}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {p.category?.name || p.categoryName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-zinc-900">₹{p.discountPrice || p.price}</span>
                        {p.discountPrice && (
                          <span className="text-[10px] text-zinc-400 line-through ml-1.5">
                            ₹{p.price}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-800">{p.stock} {p.unit}</span>
                          <StatusBadge status={stockStatus} type="inventory" />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Grocery Product' : 'Add New Grocery Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fresh Red Apples"
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Discount Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="Optional"
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Unit (e.g. kg, 500g, L, pack) *</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold">Active Status (Visible in store)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
