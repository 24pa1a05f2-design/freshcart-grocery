import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from '../../components/common/QuantitySelector';

export const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, totalAmount } = useCart();
  const navigate = useNavigate();

  const hasOutOfStockItem = items.some((item) => item.quantity > item.stock);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900">Your shopping cart is empty</h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
            Looks like you haven't added any fresh groceries yet. Explore our farm-fresh selection!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-zinc-500 mt-1">Review your basket items and quantities</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {hasOutOfStockItem && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Some items in your cart exceed available stock. Please adjust quantities before checkout.</span>
        </div>
      )}

      {/* Cart Layout: Items Table + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm divide-y divide-zinc-100">
          {items.map((item) => {
            const isExceeding = item.quantity > item.stock;

            return (
              <div key={item.product} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-zinc-100 bg-zinc-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-semibold text-sm sm:text-base text-zinc-900 hover:text-emerald-700 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      ₹{item.price} / {item.unit}
                    </p>
                    {isExceeding && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">
                        Only {item.stock} available in stock!
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity and Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-50">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(qty) => updateQuantity(item.product, qty)}
                    max={item.stock}
                  />

                  <div className="text-right min-w-[80px]">
                    <div className="font-bold text-sm sm:text-base text-zinc-900">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-bold text-base text-zinc-900 tracking-tight">Order Summary</h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-zinc-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold text-zinc-900">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Delivery Fee
              </span>
              <span className="font-semibold text-zinc-900">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            {subtotal < 500 && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                Add items worth ₹{500 - subtotal} more for <strong className="font-bold">FREE delivery</strong>!
              </p>
            )}

            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-base font-extrabold text-zinc-900">
              <span>Total Amount</span>
              <span className="text-emerald-700">₹{totalAmount}</span>
            </div>
          </div>

          <button
            disabled={hasOutOfStockItem}
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
