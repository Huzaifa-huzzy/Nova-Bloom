# Vercel API Structure

Your API routes are structured as Vercel serverless functions:

## 📁 API Directory Structure

```
api/
├── db.js                          # MongoDB connection utility
├── health.js                      # GET /api/health
├── auth/
│   ├── register.js               # POST /api/auth/register
│   ├── login.js                  # POST /api/auth/login
│   └── me.js                     # GET /api/auth/me
├── products/
│   ├── index.js                  # GET, POST /api/products
│   └── [id].js                   # GET, PUT, DELETE /api/products/:id
├── cart/
│   ├── index.js                  # GET, POST, DELETE /api/cart
│   └── [itemId].js               # PUT, DELETE /api/cart/:itemId
├── orders/
│   ├── index.js                  # GET, POST /api/orders
│   ├── [id].js                   # GET, PUT /api/orders/:id
│   └── [id]/
│       ├── pay.js                # PUT /api/orders/:id/pay
│       └── deliver.js            # PUT /api/orders/:id/deliver
└── payments/
    ├── create-intent.js          # POST /api/payments/create-intent
    └── webhook.js                # POST /api/payments/webhook
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with pagination, search, category)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item quantity (protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `GET /api/orders` - Get user orders or all orders (admin) (protected)
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/pay` - Update order to paid (protected)
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent (protected)
- `POST /api/payments/webhook` - Stripe webhook handler (public)

### Health
- `GET /api/health` - Server health check

## 🔧 How It Works

Each file in `api/` directory becomes a serverless function:
- File: `api/auth/login.js` → Endpoint: `/api/auth/login`
- File: `api/products/[id].js` → Endpoint: `/api/products/:id` (dynamic)
- File: `api/orders/[id]/pay.js` → Endpoint: `/api/orders/:id/pay` (nested dynamic)

## 📝 Notes

- All functions use MongoDB connection from `api/db.js` (cached)
- CORS headers are set in each function
- Authentication is handled via JWT tokens
- Admin routes check user role
- Stripe webhook uses raw body for signature verification

