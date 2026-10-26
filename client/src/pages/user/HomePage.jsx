import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { CategoryCard } from '../../components/common/CategoryCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { publicApi } from '../../services/api';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catRes, featRes, popRes] = await Promise.all([
          publicApi.get('/categories'),
          publicApi.get('/products/featured'),
          publicApi.get('/products/popular')
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (popRes.data.success) setPopularProducts(popRes.data.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-zinc-50 to-zinc-50 pt-10 sm:pt-16 pb-12 border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Express Hyperlocal Delivery in 30 Mins</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1]">
                Fresh groceries,{' '}
                <span className="text-emerald-600 block sm:inline">delivered to your door.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed">
                Crisp farm fruits, daily fresh milk, artisan bakery, and organic staples carefully sourced and delivered to your doorstep in minutes.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center gap-2 transition-all group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/products?category=fruits"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm border border-zinc-200 transition-all shadow-sm"
                >
                  Explore Seasonal Fruits
                </Link>
              </div>

              {/* Hero Micro-Features */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-200/80 max-w-lg">
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>30 Min Express</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Quality Checked</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free over ₹500</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh organic groceries"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-xs uppercase tracking-widest font-semibold text-emerald-300">Daily Fresh Harvest</p>
                      <p className="text-lg font-bold">100% Farm-Direct Certified Produce</p>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-4 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Over 3,400+ Orders</p>
                    <p className="text-[11px] text-zinc-500">Delivered happily this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Explore Categories</h2>
            <p className="text-xs text-zinc-500 mt-1">Browse fresh aisles for your kitchen needs</p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-28 bg-zinc-200 rounded-2xl animate-pulse"></div>
              ))
            : categories.map((cat) => <CategoryCard key={cat._id} category={cat} />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Selections
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Featured Fresh Produce</h2>
          </div>
          <Link
            to="/products?featured=true"
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-zinc-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Percent className="w-3.5 h-3.5" /> Weekend Grocery Special
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Get up to 25% discount on daily essentials & seasonal fruits
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Stock up your refrigerator with zero delivery fee on orders above ₹500. Automatic discount applied at checkout.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs sm:text-sm transition-all"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Customer Favorites
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Popular Daily Staples</h2>
          </div>
          <Link
            to="/products?sort=popular"
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>Browse all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : popularProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </div>
  );
};
