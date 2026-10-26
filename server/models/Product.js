const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    categoryName: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: 'FreshFarm'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: null
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0
    },
    unit: {
      type: String,
      default: 'kg'
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8
    },
    numReviews: {
      type: Number,
      default: 24
    }
  },
  { timestamps: true }
);

// Virtual or helper for stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock < 10) return 'Low Stock';
  return 'Available';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
