import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.product === product._id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const effectivePrice = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <div className="group relative bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container */}
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] bg-zinc-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              SAVE ₹{product.price - product.discountPrice}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              Only {product.stock} left
            </span>
          )}
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-medium text-emerald-600">{product.categoryName || 'Groceries'}</span>
            <div className="flex items-center gap-1 font-semibold text-zinc-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-sm text-zinc-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-zinc-400 mt-0.5 font-medium">Unit: {product.unit}</p>
        </div>

        {/* Pricing & Add Button */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-zinc-900">₹{effectivePrice}</span>
              {hasDiscount && (
                <span className="text-xs text-zinc-400 line-through">₹{product.price}</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">per {product.unit}</span>
          </div>

          {/* Cart Stepper or Add button */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 bg-zinc-100 text-zinc-400 rounded-xl text-xs font-semibold cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : cartItem ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-emerald-800 min-w-4 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= product.stock}
                  className="w-6 h-6 rounded-lg bg-emerald-600 shadow-sm flex items-center justify-center text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-semibold text-xs border border-emerald-200/60 hover:border-emerald-600 transition-all duration-200 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
