const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { categories, sampleProducts } = require('./seedData');

dotenv.config();

const runSeed = async (isStandalone = false) => {
  try {
    console.log('🌱 Starting database seeding process...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('🧹 Purged existing collections.');

    // 1. Create Admin
    const admin = await Admin.create({
      name: 'Store Administrator',
      email: 'admin@grocery.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    console.log(`👤 Created Admin Account: ${admin.email}`);

    // 2. Create Demo Customer
    const user = await User.create({
      name: 'Rahul Sharma',
      email: 'user@grocery.com',
      password: 'user123',
      phone: '+91 98765 43210',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          addressLine: 'Apt 402, Lotus Palm Heights, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true
        },
        {
          name: 'Rahul (Office)',
          phone: '+91 98765 43210',
          addressLine: 'Floor 3, Tech Park Central, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
          isDefault: false
        }
      ]
    });
    console.log(`👤 Created Demo Customer: ${user.email}`);

    // 3. Create Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📦 Inserted ${createdCategories.length} categories.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat;
    });

    // 4. Create Products
    const productsToInsert = sampleProducts.map((p) => {
      const cat = categoryMap[p.categorySlug] || createdCategories[0];
      return {
        ...p,
        category: cat._id,
        categoryName: cat.name
      };
    });

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`🛒 Inserted ${insertedProducts.length} grocery products.`);

    // 5. Create Realistic Sample Orders for Analytics & User Order History
    const sampleOrders = [
      {
        orderNumber: 'GR-10492',
        user: user._id,
        items: [
          {
            product: insertedProducts[0]._id,
            name: insertedProducts[0].name,
            price: insertedProducts[0].discountPrice || insertedProducts[0].price,
            quantity: 2,
            unit: insertedProducts[0].unit,
            image: insertedProducts[0].image,
            subtotal: (insertedProducts[0].discountPrice || insertedProducts[0].price) * 2
          },
          {
            product: insertedProducts[8]._id,
            name: insertedProducts[8].name,
            price: insertedProducts[8].discountPrice || insertedProducts[8].price,
            quantity: 1,
            unit: insertedProducts[8].unit,
            image: insertedProducts[8].image,
            subtotal: insertedProducts[8].discountPrice || insertedProducts[8].price
          }
        ],
        deliveryAddress: user.addresses[0],
        subtotal: (insertedProducts[0].discountPrice || insertedProducts[0].price) * 2 + (insertedProducts[8].discountPrice || insertedProducts[8].price),
        deliveryFee: 30,
        totalAmount: (insertedProducts[0].discountPrice || insertedProducts[0].price) * 2 + (insertedProducts[8].discountPrice || insertedProducts[8].price) + 30,
        paymentMethod: 'COD',
        paymentStatus: 'Completed',
        orderStatus: 'Delivered',
        statusTimeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Order placed by customer' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 86400000 + 1800000), note: 'Confirmed by store' },
          { status: 'Preparing', timestamp: new Date(Date.now() - 3 * 86400000 + 3600000), note: 'Groceries packed' },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3 * 86400000 + 7200000), note: 'Delivery agent assigned' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 3 * 86400000 + 10800000), note: 'Handed to customer' }
        ],
        createdAt: new Date(Date.now() - 3 * 86400000)
      },
      {
        orderNumber: 'GR-10823',
        user: user._id,
        items: [
          {
            product: insertedProducts[11]._id,
            name: insertedProducts[11].name,
            price: insertedProducts[11].discountPrice || insertedProducts[11].price,
            quantity: 1,
            unit: insertedProducts[11].unit,
            image: insertedProducts[11].image,
            subtotal: insertedProducts[11].discountPrice || insertedProducts[11].price
          },
          {
            product: insertedProducts[13]._id,
            name: insertedProducts[13].name,
            price: insertedProducts[13].discountPrice || insertedProducts[13].price,
            quantity: 2,
            unit: insertedProducts[13].unit,
            image: insertedProducts[13].image,
            subtotal: (insertedProducts[13].discountPrice || insertedProducts[13].price) * 2
          }
        ],
        deliveryAddress: user.addresses[0],
        subtotal: (insertedProducts[11].discountPrice || insertedProducts[11].price) + (insertedProducts[13].discountPrice || insertedProducts[13].price) * 2,
        deliveryFee: 30,
        totalAmount: (insertedProducts[11].discountPrice || insertedProducts[11].price) + (insertedProducts[13].discountPrice || insertedProducts[13].price) * 2 + 30,
        paymentMethod: 'Online',
        paymentStatus: 'Completed',
        orderStatus: 'Out for Delivery',
        statusTimeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 4), note: 'Order placed by customer' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Store confirmed order' },
          { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Groceries packed' },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 1), note: 'Driver is on the way' }
        ],
        createdAt: new Date(Date.now() - 3600000 * 4)
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`📋 Inserted ${sampleOrders.length} sample orders.`);

    console.log('✅ Seeding completed successfully!');
    console.log('-------------------------------------------');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email:    admin@grocery.com');
    console.log('   Password: admin123');
    console.log('-------------------------------------------');
    console.log('🔑 DEMO CUSTOMER LOGIN CREDENTIALS:');
    console.log('   Email:    user@grocery.com');
    console.log('   Password: user123');
    console.log('-------------------------------------------');

    if (isStandalone) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (isStandalone) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  connectDB().then(() => {
    runSeed(true);
  });
}

module.exports = { runSeed };
