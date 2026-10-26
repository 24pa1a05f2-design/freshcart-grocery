import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Package, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { publicApi } from '../../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Debounced search for instant preview
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await publicApi.get(`/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.data.success) {
          setSearchResults(res.data.products);
          setShowSearchDropdown(true);
        }
      } catch (e) {
        // ignore
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/products/${productId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
                Fresh<span className="text-emerald-600">Cart</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-widest text-zinc-400 -mt-1">
                Fast & Organic
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search fresh fruits, dairy, bakery, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-100/80 hover:bg-zinc-100 focus:bg-white text-zinc-800 placeholder-zinc-400 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none transition-all shadow-inner"
              />
            </form>

            {/* Quick search dropdown */}
            {showSearchDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-zinc-400">Searching fresh groceries...</div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-zinc-100">
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelectProduct(product._id)}
                        className="flex items-center gap-3 p-3 hover:bg-zinc-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-zinc-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-800 truncate">{product.name}</p>
                          <p className="text-xs text-zinc-400">
                            {product.categoryName} • ₹{product.discountPrice || product.price}/{product.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={handleSearchSubmit}
                      className="p-2.5 text-center text-xs font-medium text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-colors"
                    >
                      View all results for "{searchQuery}"
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-500">No groceries found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Nav links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-600 mr-2">
              <Link to="/products" className="hover:text-emerald-600 transition-colors">
                Browse All
              </Link>
              <Link to="/products?category=fruits" className="hover:text-emerald-600 transition-colors">
                Fruits
              </Link>
              <Link to="/products?category=dairy" className="hover:text-emerald-600 transition-colors">
                Dairy
              </Link>
            </nav>

            {/* Cart Icon Button */}
            <Link
              to="/cart"
              id="navbar-cart-button"
              className="relative p-2.5 rounded-xl text-zinc-700 hover:text-emerald-600 hover:bg-zinc-100 transition-all flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Customer Auth / Profile */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-all text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-zinc-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-sm">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="font-semibold text-zinc-900 truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/user/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      User Dashboard
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-zinc-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      Manage Profile
                    </Link>

                    <div className="border-t border-zinc-100 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-emerald-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-100 space-y-3 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-100 rounded-xl focus:outline-none"
              />
            </form>
            <div className="flex flex-col gap-2 pt-2 text-sm font-medium text-zinc-700">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-600 transition-colors"
              >
                Browse All Products
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-600 transition-colors"
              >
                Track Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-600 transition-colors"
              >
                My Profile & Addresses
              </Link>
              <div className="pt-2 border-t border-zinc-100 text-xs text-zinc-400 flex items-center justify-between">
                <span>Are you a store manager?</span>
                <Link to="/admin/login" className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
