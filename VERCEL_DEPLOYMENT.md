# Deploy to Vercel - Complete Guide 🚀

This guide will help you deploy your Nova Bloom MERN e-commerce application to Vercel.

## 📋 Prerequisites

1. ✅ GitHub repository (already done: https://github.com/Huzaifa-huzzy/Nova-Bloom)
2. Vercel account ([sign up here](https://vercel.com/signup))
3. MongoDB Atlas account (for database)
4. Stripe account (for payments)

---

## 🎨 Part 1: Deploy Frontend to Vercel

### Step 1: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Login"** if you have an account)
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. In Vercel dashboard, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Find and select **"Huzaifa-huzzy/Nova-Bloom"**
4. Click **"Import"**

### Step 3: Configure Frontend Deployment

Vercel should auto-detect your Vite project. Configure these settings:

**Project Settings:**
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `frontend` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `dist` (or leave default)
- **Install Command**: `npm install` (or leave default)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

**Note**: Replace `your-backend-url.onrender.com` with your actual backend URL (we'll deploy backend next).

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. Your frontend will be live at: `https://nova-bloom.vercel.app` (or your custom domain)

---

## 🖥️ Part 2: Deploy Backend (Railway - Free Tier Available)

**Important**: Vercel is optimized for frontend. For Express.js backends, Railway works perfectly and has a free tier. We'll use Railway.

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce`

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up (use GitHub)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Find and select **"Huzaifa-huzzy/Nova-Bloom"**
5. Railway will auto-detect your project. Click on the service to configure it
6. Go to **Settings** → **Root Directory**: Set to `backend`
7. **Add Environment Variables** (Settings → Variables):
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NODE_ENV=production
   FRONTEND_URL=https://nova-bloom.vercel.app
   ```

8. Railway will automatically deploy. Wait 2-5 minutes
9. Go to **Settings** → **Networking** → **Generate Domain**
10. Copy your backend URL: `https://your-project-name.up.railway.app`

### Step 3: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Go to your project → **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-project-name.up.railway.app/api
   ```
   (Replace with your actual Railway backend URL)
4. Go to **Deployments** → Click **"..."** on latest deployment → **Redeploy**

---

## 🔐 Part 3: Configure Stripe

### Step 1: Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **"Live mode"** (toggle top right)
3. Go to **Developers** → **API keys**
4. Copy:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`

### Step 2: Add Keys to Deployments

**Frontend (Vercel)**:
- `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_live_...`

**Backend (Render)**:
- `STRIPE_SECRET_KEY`: `sk_live_...`

### Step 3: Set Up Webhook

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-project-name.up.railway.app/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy webhook secret (`whsec_...`)
6. Add to Railway environment variables: `STRIPE_WEBHOOK_SECRET`

---

## ✅ Part 4: Verify Deployment

### Test Frontend
1. Visit your Vercel URL: `https://nova-bloom.vercel.app`
2. Check browser console for errors
3. Try navigating pages

### Test Backend
1. Visit: `https://your-project-name.up.railway.app/api/health`
2. Should return: `{"status":"OK","message":"Server is running"}`

### Test Full Flow
1. Register a new user
2. Browse products
3. Add to cart
4. Test checkout (use Stripe test card: `4242 4242 4242 4242`)

---

## 🔄 Part 5: Update CORS (If Needed)

If you get CORS errors, update backend `server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://nova-bloom.vercel.app',
    'http://localhost:3000' // for local dev
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

Then redeploy backend.

---

## 📝 Quick Reference

### Your URLs
- **Frontend**: `https://nova-bloom.vercel.app`
- **Backend**: `https://your-project-name.up.railway.app`
- **GitHub**: `https://github.com/Huzaifa-huzzy/Nova-Bloom`

### Environment Variables

**Vercel (Frontend)**:
```
VITE_API_URL=https://your-project-name.up.railway.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Railway (Backend)**:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://nova-bloom.vercel.app
```

---

## 🚀 Automatic Deployments

Both Vercel and Render automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Automatic deployment happens!
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `Root Directory` is set to `frontend`

**API calls failing**:
- Check `VITE_API_URL` is correct
- Verify backend is running
- Check CORS settings

### Backend Issues

**MongoDB connection error**:
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

**CORS errors**:
- Update CORS settings in `server.js`
- Add frontend URL to `FRONTEND_URL` environment variable in Railway
- Redeploy backend

---

## 🎉 Success!

Your Nova Bloom e-commerce app is now live on Vercel!

**Next Steps**:
- Set up custom domain (optional)
- Configure analytics
- Monitor performance
- Set up error tracking

---

## 💡 Tips

1. **Free Tier Limits**:
   - Vercel: Unlimited bandwidth, 100GB/month
   - Railway: $5 free credit/month (enough for small projects)

2. **Performance**:
   - Vercel CDN automatically optimizes your frontend
   - Railway provides fast, always-on deployments

3. **Monitoring**:
   - Check Vercel Analytics for frontend metrics
   - Monitor Railway logs for backend issues (available in dashboard)

---

Need help? Check the detailed guides:
- `DEPLOYMENT.md` - General deployment guide
- `QUICK_DEPLOY.md` - Quick checklist

