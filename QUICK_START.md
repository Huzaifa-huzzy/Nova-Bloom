# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Stripe account

## Setup Steps

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Stripe keys
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL and Stripe publishable key
npm run dev
```

### 3. Create Admin User
```bash
cd backend
npm run create-admin "Admin Name" "admin@example.com" "password123"
```

### 4. Seed Products (Optional)
```bash
cd backend
npm run seed-products
```
This adds 5 sample products to your database for testing.

### 5. Test the Application
1. Open http://localhost:3000
2. Register a new user
3. Browse products
4. Add items to cart
5. Checkout with Stripe test card: `4242 4242 4242 4242`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running locally, or
- Update MONGODB_URI with your Atlas connection string

### Stripe Payment Fails
- Verify Stripe keys are correct
- Use test keys for development
- Check browser console for errors

### CORS Errors
- Ensure backend is running on port 5000
- Check VITE_API_URL matches backend URL

### Content Security Policy (CSP) Font Errors
If you see CSP errors blocking Stripe fonts in the console:

1. **Use Incognito/Private Mode** (Easiest):
   - Open incognito window (extensions disabled)
   - Navigate to `http://localhost:3000`

2. **Disable Browser Extensions**:
   - Disable ad blockers, privacy extensions (uBlock Origin, Privacy Badger, etc.)
   - Or whitelist `localhost:3000` in extension settings

3. **The app will still work**, but Stripe payment forms may not render fonts correctly with CSP errors

### npm Install Errors (EPERM / Timeout)
If you see file permission errors (EPERM) or timeout errors:

1. **Close all processes**:
   - Close Cursor/VS Code and any other IDEs
   - Stop any running dev servers (Ctrl+C)
   - Close Node.js processes from Task Manager

2. **Use the fix script** (Windows PowerShell):
   ```powershell
   cd frontend
   .\fix-npm-install.ps1
   ```

3. **Manual fix**:
   ```powershell
   # Close Node processes
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   
   # Increase npm timeout
   npm config set fetch-timeout 300000
   
   # Clear cache
   npm cache clean --force
   
   # Remove node_modules and reinstall
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
   npm install
   ```

4. **If still failing**:
   - Run PowerShell as Administrator
   - Temporarily disable antivirus
   - Check internet connection
   - Try a different npm registry: `npm config set registry https://registry.npmjs.org/`

