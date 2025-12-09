# Deploy Full Stack to Vercel - Complete Guide 🚀

This guide will help you deploy your entire MERN stack (frontend + backend) to Vercel.

## 📋 Prerequisites

1. ✅ GitHub repository: `Huzaifa-huzzy/Nova-Bloom`
2. Vercel account ([sign up here](https://vercel.com/signup))
3. MongoDB Atlas account (free tier available)
4. Stripe account (for payments)

---

## 🎯 Overview

Your project structure:
- **Frontend**: React/Vite app in `frontend/` directory
- **Backend**: Express.js API converted to Vercel serverless functions in `api/` directory
- **Models**: Shared MongoDB models in `backend/models/`

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (FREE tier)
4. Create database user:
   - Database Access → Add New Database User
   - Username: `mernuser` (or your choice)
   - Password: Generate secure password (save it!)
5. Whitelist IP:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (`0.0.0.0/0`)
6. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `ecommerce`
   - Example: `mongodb+srv://mernuser:password123@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority`

### Step 2: Set Up Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live mode** (toggle top right)
3. Go to **Developers** → **API keys**
4. Copy:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`
5. Set up webhook (after deployment):
   - Developers → Webhooks → Add endpoint
   - URL: `https://your-project.vercel.app/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret: `whsec_...`

### Step 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import Git Repository**:
   - Find and select `Huzaifa-huzzy/Nova-Bloom`
   - Click **"Import"**

5. **Configure Project Settings**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install` (installs root dependencies)

6. **Add Environment Variables**:
   Click **"Environment Variables"** and add:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NODE_ENV=production
   VITE_API_URL=https://your-project.vercel.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```

   **Important Notes**:
   - Replace all placeholder values with your actual values
   - `VITE_API_URL` will be your Vercel domain (update after first deploy)
   - Generate a strong `JWT_SECRET` (minimum 32 characters)

7. **Click "Deploy"**
8. Wait 3-5 minutes for deployment

### Step 4: Update Environment Variables After First Deploy

After first deployment:

1. Go to Vercel dashboard → Your project
2. Copy your deployment URL: `https://your-project.vercel.app`
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-project.vercel.app/api
   ```
5. Go to **Deployments** → Latest → **"..."** → **Redeploy**

### Step 5: Configure Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-project.vercel.app/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy webhook signing secret (`whsec_...`)
6. Go to Vercel → **Settings** → **Environment Variables**
7. Update `STRIPE_WEBHOOK_SECRET` with the webhook secret
8. Redeploy

---

## ✅ Verify Deployment

### Test Frontend
1. Visit: `https://your-project.vercel.app`
2. Check browser console for errors
3. Try navigating pages

### Test Backend API
1. Visit: `https://your-project.vercel.app/api/health`
2. Should return: `{"status":"OK","message":"Server is running"}`

### Test Full Flow
1. Register a new user: `/register`
2. Login: `/login`
3. Browse products: `/products`
4. Add to cart
5. Checkout (use Stripe test card: `4242 4242 4242 4242`)

---

## 🔧 API Endpoints

Your API endpoints are available at:
- `https://your-project.vercel.app/api/auth/register`
- `https://your-project.vercel.app/api/auth/login`
- `https://your-project.vercel.app/api/auth/me`
- `https://your-project.vercel.app/api/products`
- `https://your-project.vercel.app/api/products/[id]`
- `https://your-project.vercel.app/api/cart`
- `https://your-project.vercel.app/api/orders`
- `https://your-project.vercel.app/api/payments/create-intent`
- `https://your-project.vercel.app/api/payments/webhook`

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically deploys!
```

---

## 🐛 Troubleshooting

### Build Fails

**Check build logs**:
1. Vercel dashboard → Your project → **Deployments**
2. Click on failed deployment
3. Check **Build Logs** tab

**Common issues**:
- Missing dependencies in root `package.json`
- Environment variables not set
- Build command incorrect

**Fix**:
- Ensure root `package.json` has all backend dependencies
- Check environment variables are set
- Verify build commands

### API Routes Not Working

**Check**:
1. API routes are in `api/` directory
2. Files export default function handler
3. Environment variables are set
4. MongoDB connection string is correct

**Test**:
- Visit `/api/health` - should return JSON
- Check Vercel function logs

### MongoDB Connection Error

**Check**:
1. `MONGODB_URI` is correct
2. MongoDB Atlas IP whitelist allows all (`0.0.0.0/0`)
3. Database user credentials are correct
4. Connection string includes database name

### CORS Errors

**Fix**: CORS is handled in each API function. If you see CORS errors:
1. Check `Access-Control-Allow-Origin` headers in API functions
2. Verify frontend URL matches your Vercel domain

### Stripe Webhook Not Working

**Check**:
1. Webhook URL is correct: `https://your-project.vercel.app/api/payments/webhook`
2. `STRIPE_WEBHOOK_SECRET` is set correctly
3. Webhook events are selected in Stripe dashboard
4. Check Vercel function logs for webhook errors

---

## 📊 Monitoring

### View Logs
1. Vercel dashboard → Your project
2. **Functions** tab → Click on any function
3. View real-time logs

### Check Deployments
- **Deployments** tab shows all deployments
- Green = Success
- Red = Failed (click to see logs)

---

## 💰 Free Tier Limits

Vercel Free Tier:
- ✅ Unlimited bandwidth
- ✅ 100GB bandwidth/month
- ✅ Serverless functions: 100GB-hours/month
- ✅ 100 function invocations/second

**Note**: For most small projects, free tier is sufficient.

---

## 🎉 Success!

Your full-stack MERN application is now live on Vercel!

**Your URLs**:
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/*`

**Next Steps**:
- Set up custom domain (optional)
- Configure analytics
- Monitor performance
- Set up error tracking

---

## 📚 Project Structure

```
nova-bloom/
├── api/                    # Vercel serverless functions
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   │   └── me.js
│   ├── products/
│   │   ├── index.js
│   │   └── [id].js
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   └── db.js              # MongoDB connection
├── backend/
│   ├── models/            # Shared models
│   └── middleware/
├── frontend/              # React/Vite app
│   ├── src/
│   └── dist/              # Build output
└── vercel.json            # Vercel configuration
```

---

## 🔐 Security Notes

- ✅ Environment variables are secure (not exposed to frontend)
- ✅ `.env` files are in `.gitignore`
- ✅ MongoDB connection string is encrypted
- ✅ JWT secrets are secure
- ✅ Stripe keys are properly configured

---

Need help? Check Vercel logs or see detailed troubleshooting in deployment logs.

