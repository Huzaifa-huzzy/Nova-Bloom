# Vercel Environment Variables Guide 🔐

## Understanding Vercel Environment Variables

In Vercel, you add environment variables in **one place**, but they're used differently:

1. **Server-side variables** (API/Backend): Used by serverless functions, NOT exposed to frontend
2. **Client-side variables** (Frontend): Must start with `VITE_` to be accessible in React

---

## 📍 Where to Add Environment Variables

### Step 1: Go to Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → Login
2. Select your project: **Nova-Bloom**
3. Click **"Settings"** (top menu)
4. Click **"Environment Variables"** (left sidebar)

### Step 2: Add Each Variable

Click **"Add New"** for each variable below.

---

## 🔧 Required Environment Variables

### Backend/Server-Side Variables (No VITE_ prefix)

These are used by your API serverless functions and are **NOT exposed** to the frontend:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce` | MongoDB connection string |
| `JWT_SECRET` | `your_super_secret_key_minimum_32_characters` | Secret for JWT tokens |
| `JWT_EXPIRE` | `7d` | JWT expiration time |
| `STRIPE_SECRET_KEY` | `sk_live_51AbCdEf...` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_1234567890...` | Stripe webhook signing secret |
| `NODE_ENV` | `production` | Node environment |

**Important**: These are **secure** and only accessible in serverless functions.

---

### Frontend/Client-Side Variables (Must have VITE_ prefix)

These are **exposed** to the browser and must start with `VITE_`:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `VITE_API_URL` | `https://your-project.vercel.app/api` | Your API base URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_51AbCdEf...` | Stripe publishable key |

**Important**: 
- These are **public** (visible in browser)
- Must start with `VITE_` to work with Vite
- Update `VITE_API_URL` after first deployment with your actual Vercel URL

---

## 📝 Step-by-Step: Adding Variables

### Method 1: Add One by One

1. In **Environment Variables** page, click **"Add New"**
2. Enter:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Select all (Production, Preview, Development)
3. Click **"Save"**
4. Repeat for each variable

### Method 2: Add Multiple at Once

1. Click **"Add New"**
2. Add first variable
3. Click **"Add Another"** to add more without leaving the page

---

## 🎯 Environment Selection

For each variable, select which environments it applies to:

- ✅ **Production**: Live site
- ✅ **Preview**: Preview deployments (pull requests)
- ✅ **Development**: Local development (`vercel dev`)

**Recommendation**: Select all three for most variables.

---

## 📋 Complete List (Copy-Paste Ready)

Add these variables one by one:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_12345
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NODE_ENV=production
VITE_API_URL=https://your-project.vercel.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
```

**Note**: Replace all placeholder values with your actual values!

---

## 🔄 After Adding Variables

### Step 1: Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** (optional)
5. Click **"Redeploy"**

### Step 2: Update VITE_API_URL After First Deploy

After your first successful deployment:

1. Copy your Vercel URL: `https://your-project.vercel.app`
2. Go to **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. Click **"Edit"**
5. Update value to: `https://your-project.vercel.app/api`
6. Save
7. Redeploy

---

## 🔍 How to Verify Variables Are Set

### Check Server-Side Variables (Backend)

1. Go to **Functions** tab in Vercel
2. Click on any API function (e.g., `/api/health`)
3. View logs - if MongoDB connects, variables are working

### Check Client-Side Variables (Frontend)

1. Open your deployed site
2. Open browser DevTools (F12)
3. Go to **Console**
4. Type: `console.log(import.meta.env.VITE_API_URL)`
5. Should show your API URL

---

## ⚠️ Important Notes

### Security

- ✅ **Server-side variables** (`MONGODB_URI`, `JWT_SECRET`, etc.) are **secure** - never exposed to browser
- ⚠️ **Client-side variables** (`VITE_*`) are **public** - anyone can see them in browser
- ❌ **Never** put secrets in `VITE_*` variables!

### Variable Naming

- Backend variables: No prefix needed (e.g., `MONGODB_URI`)
- Frontend variables: Must start with `VITE_` (e.g., `VITE_API_URL`)

### Accessing Variables in Code

**Backend (API functions)**:
```javascript
// In api/auth/login.js
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
```

**Frontend (React)**:
```javascript
// In frontend/src/store/slices/productSlice.js
const API_URL = import.meta.env.VITE_API_URL;
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

---

## 🐛 Troubleshooting

### Variables Not Working?

1. **Check spelling**: Variable names are case-sensitive
2. **Redeploy**: Variables only apply after redeployment
3. **Check environment**: Make sure you selected the right environment
4. **Check logs**: Vercel Functions tab shows errors

### Frontend Can't Access VITE_ Variables?

1. Make sure variable starts with `VITE_`
2. Redeploy after adding variable
3. Check browser console for errors
4. Verify variable is set in Vercel dashboard

### Backend Can't Access Variables?

1. Check variable is set (no `VITE_` prefix for backend)
2. Check spelling matches exactly
3. Redeploy
4. Check function logs in Vercel

---

## 📸 Visual Guide

### Where to Find Environment Variables:

```
Vercel Dashboard
├── Your Project (Nova-Bloom)
    ├── Settings (top menu)
        ├── Environment Variables (left sidebar)
            ├── Add New (button)
                ├── Key: MONGODB_URI
                ├── Value: mongodb+srv://...
                └── Environment: Production, Preview, Development
```

---

## ✅ Quick Checklist

- [ ] Added `MONGODB_URI`
- [ ] Added `JWT_SECRET` (32+ characters)
- [ ] Added `JWT_EXPIRE`
- [ ] Added `STRIPE_SECRET_KEY`
- [ ] Added `STRIPE_WEBHOOK_SECRET` (after webhook setup)
- [ ] Added `NODE_ENV` = `production`
- [ ] Added `VITE_API_URL` (update after first deploy)
- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Selected all environments for each variable
- [ ] Redeployed after adding variables
- [ ] Updated `VITE_API_URL` with actual Vercel URL
- [ ] Verified variables work

---

## 🎉 Done!

Once all variables are added and you've redeployed, your app should work perfectly!

**Need help?** Check Vercel logs or see `VERCEL_FULL_DEPLOYMENT.md` for detailed deployment guide.

