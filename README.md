# FreshCart — Full-Stack Grocery Delivery Management Platform

A modern, minimalist, full-stack **Grocery Delivery Management App** built with React (Vite), Tailwind CSS, Node.js, Express, MongoDB (Mongoose), and JWT authentication. It features **strictly separated authentication and dashboards** for Customers and Store Administrators.

---

## 🌟 Key Features

### 🛒 Customer Application
- **Modern Minimalist Storefront**: Clean, airy layout with crisp typography, emerald accents, and responsive navigation.
- **Product Discovery & Instant Search**: Debounced global search matching product name, category, and brand with instant dropdown previews.
- **Category Filtering & Sorting**: Filter by 10 departments (Fruits, Vegetables, Dairy, Bakery, Beverages, Snacks, Rice & Grains, Personal Care, Household, Frozen Foods), price range, and stock availability.
- **Product Details & Steppers**: High-resolution image preview, pricing, stock badges, inline quantity steppers, and related products.
- **Persistent Shopping Cart**: Real-time subtotal calculation, free delivery tier (free above ₹500, else ₹30), and out-of-stock checkout prevention.
- **Multi-Step Checkout**:
  1. Delivery address selection or inline address creation.
  2. Order itemized summary.
  3. Payment selection (Cash on Delivery & Online/UPI simulation).
- **Interactive Live Order Tracking**: Step-by-step visual timeline:
  `Order Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered` (synced in real-time with Admin status updates).
- **Customer Profile & Address Book**: Manage saved addresses, edit personal info, change password, and view order history.

### 🛡️ Store Administrator Portal
- **Strictly Isolated Admin Flow**: Separate login route (`/admin/login`), separate JWT token, and independent session storage. Normal users cannot access admin dashboards or admin endpoints.
- **Overview Dashboard**:
  - Live KPI cards: Total Orders, Total Revenue, Total Users, and Catalog Items.
  - Interactive charts (Area revenue chart and Order status bar chart powered by Recharts).
  - Low-stock inventory warnings.
  - Recent orders and newly registered customers.
- **Product Management (`/admin/products`)**:
  - Add, edit, and delete products.
  - Assign categories, set regular & discount prices, define stock and units (kg, L, pack, etc.).
- **Category Management (`/admin/categories`)**:
  - Add, edit, and delete categories with auto-slug generation and product safety checks.
- **Order Management (`/admin/orders`)**:
  - Real-time status update dropdown (`Pending`, `Confirmed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`).
  - Detailed modal inspection of customer delivery addresses, phone numbers, and items.
- **Inventory & Stock Control (`/admin/inventory`)**:
  - Real-time classification: `Available` (10+), `Low Stock` (< 10), and `Out of Stock` (0).
  - Inline quick-restock editor with single-click save.
- **Store Analytics (`/admin/analytics`)**:
  - Revenue growth trend, category inventory depth, and payment method split.

---

## 🔐 Credentials & Seed Accounts

The database comes pre-seeded with grocery categories, products, sample past orders, and dedicated test accounts:

| Role | Email | Password | Login Route |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@grocery.com` | `admin123` | [`/admin/login`](http://localhost:5173/admin/login) |
| **Customer** | `user@grocery.com` | `user123` | [`/login`](http://localhost:5173/login) |

*Both login screens feature a 1-click **Auto Fill** button for instant testing.*

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router , Recharts.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT).
- **Database**: MongoDB & Mongoose.

---

## 📂 Project Structure

```text
FSD(2)/
├── client/                      # React (Vite) Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # AdminSidebar, AdminNavbar, StatCard, StatusBadge
│   │   │   └── common/          # Navbar, Footer, ProductCard, CategoryCard, Modal, QuantitySelector
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Customer session & address book
│   │   │   ├── AdminAuthContext.jsx  # Admin session & authorization
│   │   │   ├── CartContext.jsx       # Shopping cart & stock limits
│   │   │   └── ToastContext.jsx      # Feedback notifications
│   │   ├── layouts/
│   │   │   ├── UserLayout.jsx   # Storefront layout
│   │   │   └── AdminLayout.jsx  # Protected admin layout with sidebar
│   │   ├── pages/
│   │   │   ├── user/            # Home, Products, Detail, Cart, Checkout, Orders, Profile
│   │   │   └── admin/           # Dashboard, Products, Categories, Orders, Users, Inventory, Analytics, Settings
│   │   ├── services/
│   │   │   └── api.js           # Dedicated userApi, adminApi, publicApi instances
│   │   ├── App.jsx              # Complete route hierarchy
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                      # Node.js Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection with in-memory zero-config fallback
│   ├── controllers/
│   │   ├── authController.js        # Customer auth & addresses
│   │   ├── adminAuthController.js   # Admin auth
│   │   ├── productController.js     # Public queries
│   │   ├── categoryController.js    # Public categories
│   │   ├── orderController.js       # Customer orders & cancellation
│   │   └── adminController.js       # Admin CRUD, KPIs, status update, inventory
│   ├── middleware/
│   │   ├── authMiddleware.js        # protectUser and protectAdmin guards
│   │   └── errorMiddleware.js       # Central error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminAuthRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── orderRoutes.js
│   ├── seed/
│   │   ├── seedData.js          # Realistic grocery catalog & images
│   │   └── seed.js              # Standalone or automatic seeder
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Installation
Install all dependencies for root, client, and server:
```bash
npm run install:all
```

### 2. Environment Configuration
Ensure `.env` exists in `server/` (copied from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/grocery_delivery
JWT_SECRET=grocery_super_secret_jwt_key_2026_customer
ADMIN_JWT_SECRET=grocery_super_secret_jwt_key_2026_admin_portal
```
*(If no local MongoDB daemon is running, the app automatically initializes an embedded in-memory MongoDB database and seeds it automatically).*

### 3. Run Both Servers Simultaneously
```bash
npm run dev
```
- **Frontend**: [`http://localhost:5173`](http://localhost:5173)
- **Backend API**: [`http://localhost:5000`](http://localhost:5000)
- **Wedsite Live on** :[https://client-nine-ebon-91.vercel.app](https://client-nine-ebon-91.vercel.app)

### 4. Optional Manual Re-seed
```bash
npm run seed
```

---

## 🔒 Security & Role Separation Implementation

1. **Tokens**:
   - Customers receive a token signed with `JWT_SECRET` containing `{ id, role: 'customer' }`.
   - Admins receive a token signed with `ADMIN_JWT_SECRET` containing `{ id, role: 'admin' }`.
2. **Backend Protection**:
   - `protectUser` validates the customer token and rejects admin tokens or unauthenticated requests.
   - `protectAdmin` validates the admin token, checks `role === 'admin'` in database, and rejects any customer token with `403 Forbidden`.
3. **Storage Separation**:
   - Customer token: `localStorage.getItem('grocery_user_token')`
   - Admin token: `localStorage.getItem('grocery_admin_token')`
4. **Password Hashing**:
   - All passwords are encrypted with `bcryptjs` salt rounds before database insertion. Plain-text passwords are never exposed.

---

## 📋 API Endpoints Reference

### Customer Auth (`/api/auth`)
- `POST /api/auth/register` — Create new customer
- `POST /api/auth/login` — Customer login
- `POST /api/auth/logout` — Customer logout
- `GET  /api/auth/me` — Current profile *(Protected)*
- `PUT  /api/auth/profile` — Update name & phone *(Protected)*
- `PUT  /api/auth/change-password` — Change password *(Protected)*
- `POST /api/auth/address` — Add address *(Protected)*
- `PUT  /api/auth/address/:id` — Update address *(Protected)*
- `DELETE /api/auth/address/:id` — Delete address *(Protected)*

### Admin Auth (`/api/admin`)
- `POST /api/admin/login` — Admin login
- `POST /api/admin/logout` — Admin logout
- `GET  /api/admin/me` — Current admin session *(Admin only)*

### Products & Categories (`/api/products`, `/api/categories`)
- `GET    /api/products` — Filter, search, paginate products
- `GET    /api/products/featured` — Featured items
- `GET    /api/products/popular` — Customer favorites
- `GET    /api/products/:id` — Product details
- `POST   /api/products` — Create product *(Admin only)*
- `PUT    /api/products/:id` — Edit product *(Admin only)*
- `DELETE /api/products/:id` — Delete product *(Admin only)*
- `GET    /api/categories` — Category list with product counts
- `POST   /api/categories` — Create category *(Admin only)*
- `PUT    /api/categories/:id` — Edit category *(Admin only)*
- `DELETE /api/categories/:id` — Delete category *(Admin only)*

### Orders (`/api/orders`)
- `POST /api/orders` — Checkout order & reduce stock *(Customer)*
- `GET  /api/orders` — Customer order history *(Customer)*
- `GET  /api/orders/:id` — Order tracking details *(Customer)*
- `PUT  /api/orders/:id/cancel` — Cancel order & restore stock *(Customer)*
- `PUT  /api/orders/:id/status` — Update order status *(Admin only)*

### Admin Dashboard & Management (`/api/admin`)
- `GET /api/admin/dashboard` — KPI cards, recent orders, charts *(Admin)*
- `GET /api/admin/analytics` — Revenue & category analytics *(Admin)*
- `GET /api/admin/products` — Catalog table *(Admin)*
- `GET /api/admin/categories` — Category table *(Admin)*
- `GET /api/admin/orders` — Order queue table *(Admin)*
- `GET /api/admin/users` — Customer list & order stats *(Admin)*
- `PUT /api/admin/users/:id/status` — Activate/deactivate user *(Admin)*
- `GET /api/admin/users/:id/orders` — User order history *(Admin)*
- `GET /api/admin/inventory` — Shelf stock & alerts *(Admin)*
- `PUT /api/admin/inventory/:id` — Inline stock adjustment *(Admin)*
