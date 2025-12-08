# MERN E-Commerce Application

A full-stack e-commerce application built with MongoDB, Express, React, and Node.js (MERN stack). Features include JWT authentication, product management, shopping cart, Stripe payment integration, and order management.

## Features

- **User Authentication**: JWT-based login and registration
- **Product Management**: Full CRUD operations for products (admin only)
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout**: Secure checkout process with Stripe payment integration
- **Order Management**: Order history for users and order management for admins
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- bcryptjs for password hashing

### Frontend
- React 18
- Redux Toolkit
- React Router
- Axios
- Stripe React components
- Tailwind CSS
- Vite

## Project Structure

```
Demo-Mern/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   └── routing/
│   │   │       ├── PrivateRoute.jsx
│   │   │       └── AdminRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── admin/
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminOrders.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── cartSlice.js
│   │   │       └── orderSlice.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Stripe account (for payment processing)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Stripe Setup

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. For testing, use test keys (they start with `sk_test_` and `pk_test_`)
4. Add the keys to your `.env` files as shown above
5. For webhook testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Usage

### Creating an Admin User

To create an admin user, you can use the provided script:

```bash
cd backend
npm run create-admin "Admin Name" "admin@example.com" "password123"
```

Or manually update the user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Seeding Products

To add sample products to the database, use the seed script:

```bash
cd backend
npm run seed-products
```

This will add 26 sample products to your database across multiple categories:
- **Electronics**: Wireless Headphones, Smart Watch, Mouse, Keyboard, USB-C Hub, Earbuds, Speaker, Webcam, Fitness Tracker, Portable Charger
- **Clothing**: T-Shirt, Denim Jacket, Hoodie, Jeans
- **Accessories**: Backpack, Laptop Stand, Sunglasses, Water Bottle, Tablet Stand, Reading Glasses, Duffel Bag, Phone Case
- **Sports**: Running Shoes, Yoga Mat
- **Home & Kitchen**: Coffee Maker, Desk Lamp

The script automatically skips products that already exist to prevent duplicates.

### Testing the Application

1. **Register a new user**: Navigate to `/register` and create an account
2. **Browse products**: View all products on the `/products` page
3. **Add to cart**: Click on a product and add it to your cart
4. **Checkout**: Go to cart and proceed to checkout
5. **Test payment**: Use Stripe test card: `4242 4242 4242 4242`
6. **Admin features**: Login as admin to manage products and orders

### Stripe Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with pagination, search, category filter)
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
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders or all orders (admin) (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/pay` - Update order to paid (protected)
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent (protected)
- `POST /api/payments/webhook` - Stripe webhook handler

## Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update `MONGODB_URI` to your production MongoDB connection string
3. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` with production keys
4. Deploy the backend

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set environment variables:
- `VITE_API_URL` - Your backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

3. Deploy the `dist` folder

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your backend `.env` file

### Stripe Webhook Setup

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-backend-url.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### npm Install Errors (EPERM / Timeout)

If you encounter file permission errors (EPERM) or network timeout errors during `npm install`:

**Quick Fix (Windows PowerShell):**
```powershell
# 1. Close all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Increase npm timeout (5 minutes)
npm config set fetch-timeout 300000
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

# 3. Clear npm cache
npm cache clean --force

# 4. Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 5. Reinstall dependencies
npm install
```

**Alternative: Use the fix script**
```powershell
cd frontend
.\fix-npm-install.ps1
```

**If issues persist:**
- Close Cursor/VS Code and any other IDEs completely
- Run PowerShell as Administrator
- Temporarily disable antivirus software
- Check your internet connection
- Verify npm registry: `npm config get registry`
- Try a different registry: `npm config set registry https://registry.npmjs.org/`

### MongoDB Connection Error

See the troubleshooting section in [QUICK_START.md](./QUICK_START.md) for detailed MongoDB setup instructions.

### Content Security Policy (CSP) Font Errors

If you see CSP errors like `"Refused to load the font because it violates Content Security Policy directive: font-src 'none'"`:

**This is caused by browser extensions injecting restrictive CSP headers that override the page's CSP.**

**Quick Fixes (in order of preference):**

1. **Use Incognito/Private Mode** (Recommended for testing):
   - Open an incognito/private window (extensions are usually disabled)
   - Navigate to `http://localhost:3000`
   - This will eliminate the CSP errors immediately

2. **Disable Browser Extensions**:
   - Common culprits: uBlock Origin, Privacy Badger, NoScript, AdBlock Plus, or security extensions
   - Disable extensions one by one to identify the problematic one
   - Or disable all extensions temporarily for development

3. **Whitelist Localhost in Extension Settings**:
   - Open the problematic extension's settings
   - Add `localhost:3000` to the whitelist/allowed sites
   - Common extensions that need whitelisting:
     - uBlock Origin: Dashboard → Settings → Trusted sites
     - Privacy Badger: Options → Domains → Add `localhost`

4. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Check the Console tab for specific CSP error messages
   - Look for which extension is injecting the restrictive policy

**Note**: The app will still function with these CSP errors, but Stripe's payment form may not render fonts correctly. For development, using incognito mode is the easiest solution.

## Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Implement rate limiting for production
- Use HTTPS in production
- Validate and sanitize all user inputs
- Keep dependencies updated

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the repository.

