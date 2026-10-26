import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, Clock, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-200/80 pt-12 pb-8 mt-16 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-zinc-100">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 text-sm">30-Min Delivery</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Quick hyperlocal delivery to your doorstep</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 text-sm">100% Quality Checked</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Directly sourced farm-fresh organics</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 text-sm">Real-Time Tracking</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Live order updates from store to door</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 text-sm">Zero Fee Above ₹500</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Enjoy free delivery on bulk grocery orders</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                FC
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                Fresh<span className="text-emerald-600">Cart</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm mb-4">
              Modern grocery delivery management platform. Ultra-fast delivery, curated organic staples, and reliable daily essentials at wholesale prices.
            </p>
            <div className="inline-flex items-center gap-2 text-xs bg-zinc-100 px-3 py-1.5 rounded-lg text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Delivery Service Active
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=fruits" className="hover:text-emerald-600">Fresh Fruits</Link></li>
              <li><Link to="/products?category=vegetables" className="hover:text-emerald-600">Organic Vegetables</Link></li>
              <li><Link to="/products?category=dairy" className="hover:text-emerald-600">Milk & Dairy</Link></li>
              <li><Link to="/products?category=bakery" className="hover:text-emerald-600">Bakery Goods</Link></li>
              <li><Link to="/products?category=beverages" className="hover:text-emerald-600">Juices & Beverages</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/orders" className="hover:text-emerald-600">Track My Order</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-600">Delivery Addresses</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-600">Shopping Cart</Link></li>
              <li><span className="text-zinc-400">Help Center (24x7)</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">Management</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </li>
              <li><span className="text-zinc-400">Inventory Management</span></li>
              <li><span className="text-zinc-400">Store Analytics</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
          <p>© {new Date().getFullYear()} FreshCart Grocery Delivery. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern minimalism & performance <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
