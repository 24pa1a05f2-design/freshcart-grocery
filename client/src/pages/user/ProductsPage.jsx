import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { publicApi } from '../../services/api';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search and filter states derived from query parameters
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const inStock = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
        if (sort) params.set('sort', sort);
        if (inStock) params.set('inStock', 'true');
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await publicApi.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalProducts(res.data.totalProducts);
          setTotalPages(res.data.pages);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, sort, inStock, minPrice, maxPrice, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const filterSidebar = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider mb-3">Categories</h4>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', 'all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam('category', cat.slug || cat.name.toLowerCase())}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.slug || selectedCategory === cat.name.toLowerCase()
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <span>{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className="text-[10px] text-zinc-400">({cat.productCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="pt-4 border-t border-zinc-200">
        <h4 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider mb-3">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Reset Filter Button */}
      <button
        onClick={handleResetFilters}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Fresh Grocery Aisles
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Showing {totalProducts} wholesome farm items
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </p>
        </div>

        {/* Search input + Mobile Filter Trigger */}
        <div className="flex items-center gap-2.5 max-w-md w-full">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search apples, milk, bread..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
            />
          </form>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sort Toolbar */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span className="hidden sm:inline">Sort results by:</span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Newest Additions</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="md:hidden p-4 bg-white rounded-2xl border border-zinc-200 shadow-lg mb-6">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-900">Filters</h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="text-xs font-semibold text-emerald-600"
            >
              Done
            </button>
          </div>
          {filterSidebar}
        </div>
      )}

      {/* Layout Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden md:block col-span-1 bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm sticky top-24">
          {filterSidebar}
        </div>

        {/* Product Grid */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-zinc-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParam('page', (page - 1).toString())}
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-zinc-500 font-medium px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => updateParam('page', (page + 1).toString())}
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-800">No groceries found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                We couldn't find items matching your search or filters. Try adjusting your query or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
