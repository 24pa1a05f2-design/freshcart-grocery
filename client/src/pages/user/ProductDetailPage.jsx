import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { ProductCard } from '../../components/common/ProductCard';
import { useCart } from '../../context/CartContext';
import { publicApi } from '../../services/api';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await publicApi.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-400 font-medium">Loading grocery details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">The item you are looking for is no longer available or was moved.</p>
        <Link
          to="/products"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
        >
          Return to Grocery Aisles
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const effectivePrice = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <Link to="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="font-semibold text-zinc-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm overflow-hidden">
          <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-50 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Save ₹{product.price - product.discountPrice}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                {product.category?.name || product.categoryName}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-[10px] text-zinc-400 font-normal">({product.numReviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Brand: <span className="font-semibold text-zinc-700">{product.brand || 'FreshFarm'}</span></p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-zinc-900">₹{effectivePrice}</span>
            {hasDiscount && (
              <span className="text-base text-zinc-400 line-through">₹{product.price}</span>
            )}
            <span className="text-xs font-medium text-zinc-500">/ per {product.unit}</span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-500">Availability:</span>
            {isOutOfStock ? (
              <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                Low Stock — Only {product.stock} left
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-zinc-700">Quantity ({product.unit})</label>
            <div className="flex flex-wrap items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={product.stock}
                disabled={isOutOfStock}
                size="lg"
              />

              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className="flex-1 min-w-[200px] py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">Description</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {product.description || 'Farm-fresh grocery item harvested and packed under hygienic standards.'}
            </p>
          </div>

          {/* Value Props Micro Grid */}
          <div className="pt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 text-xs text-zinc-600">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-zinc-100">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Express 30 min delivery</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-zinc-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hygienically Packed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">More in this Category</h2>
            <Link
              to={`/products?category=${product.category?.slug || product.categoryName}`}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
