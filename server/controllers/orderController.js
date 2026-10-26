const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod = 'COD', customerNotes = '' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items to checkout.'
      });
    }

    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.addressLine || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address is required'
      });
    }

    // Validate products & check stock
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product || item._id);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || 'Unknown'}" is no longer available.`
        });
      }

      const qty = Number(item.quantity);
      if (qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for "${product.name}".`
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      const effectivePrice = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

      const itemSubtotal = effectivePrice * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: effectivePrice,
        discountPrice: product.discountPrice,
        quantity: qty,
        unit: product.unit,
        image: product.image,
        subtotal: itemSubtotal
      });
    }

    // Delivery fee rule: Free delivery above ₹500, else ₹30
    const deliveryFee = subtotal >= 500 ? 0 : 30;
    const totalAmount = subtotal + deliveryFee;

    // Deduct stock for each item
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const orderNumber = `GR-${Date.now().toString().slice(-5)}${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: validatedItems,
      deliveryAddress: {
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        addressLine: deliveryAddress.addressLine,
        city: deliveryAddress.city,
        state: deliveryAddress.state || 'State',
        pincode: deliveryAddress.pincode
      },
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'Completed' : 'Pending',
      paymentDetails: {
        transactionId: paymentMethod === 'Online' ? `TXN-${Date.now()}` : '',
        method: paymentMethod
      },
      orderStatus: 'Pending',
      statusTimeline: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed successfully'
        }
      ],
      customerNotes
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders
// @access  Private (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name image unit price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (if not already out for delivery or delivered)
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (['Out for Delivery', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled at status: ${order.orderStatus}`
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusTimeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: 'Cancelled by customer'
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
