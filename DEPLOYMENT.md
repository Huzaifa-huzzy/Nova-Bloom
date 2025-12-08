# Deployment Guide - MERN E-Commerce Application

This guide will walk you through deploying your MERN stack e-commerce application to production.

## 🚀 Recommended Platforms

- **Frontend**: Vercel or Netlify (best for React/Vite)
- **Backend**: Render or Railway (best for Node.js/Express)
- **Database**: MongoDB Atlas (cloud MongoDB)
- **Payment**: Stripe (already configured)

---

## 📋 Prerequisites

1. GitHub account (for version control)
2. MongoDB Atlas account (free tier available)
3. Stripe account (for payments)
4. Accounts on chosen hosting platforms

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose FREE tier)
4. Create a database user:
   - Go to Database Access → Add New Database User
   - Username: `mernuser` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: Read and write to any database
5. Whitelist IP Address:
   - Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add your backend server IP
6. Get Connection String:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `ecommerce` (or your database name)
   - Example: `mongodb+srv://mernuser:password123@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority`

---

## 🔧 Step 2: Prepare Your Code

### 2.1 Update Environment Variables

Create `.env.example` files for reference (these will be committed to git):

**Backend `.env.example`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=production
```

**Frontend `.env.example`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 2.2 Update CORS Settings (if needed)

Your backend already has `app.use(cors())` which allows all origins. For production, you might want to restrict it:

```javascript
// In backend/server.js, replace cors() with:
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
```

### 2.3 Commit Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 3: Deploy Backend (Render)

### Option A: Render (Recommended)

1. Go to [Render](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mern-ecommerce-backend` (or your choice)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying from root)
5. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_live_your_stripe_live_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://mern-ecommerce-backend.onrender.com`)

### Option B: Railway

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add Environment Variables (same as Render)
5. Set Root Directory to `backend` if deploying from monorepo
6. Deploy!

---

## 🎨 Step 4: Deploy Frontend (Vercel)

### Option A: Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)
8. Your site will be live at `https://your-project.vercel.app`

### Option B: Netlify

1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variables (same as Vercel)
6. Click "Deploy site"

---

## 🔐 Step 5: Configure Stripe

### 5.1 Get Production Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to "Live mode" (toggle in top right)
3. Go to Developers → API keys
4. Copy your **Live** keys:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### 5.2 Set Up Webhook

1. In Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend-url.onrender.com/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret (`whsec_...`)
6. Add it to your backend environment variables as `STRIPE_WEBHOOK_SECRET`

---

## ✅ Step 6: Verify Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit your Vercel/Netlify URL
   - Check browser console for errors
   - Try logging in/registering

3. **Test Database Connection**:
   - Try creating a product (if admin)
   - Check MongoDB Atlas → Collections to see if data appears

4. **Test Payments**:
   - Use Stripe test cards in production mode
   - Or use real cards (small amounts for testing)

---

## 🔄 Step 7: Update CORS (If Needed)

If you get CORS errors, update your backend `server.js`:

```javascript
// Replace app.use(cors()) with:
const corsOptions = {
  origin: [
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

Then redeploy your backend.

---

## 📝 Step 8: Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend is loading correctly
- [ ] Database connection is working
- [ ] User registration/login works
- [ ] Products are loading
- [ ] Cart functionality works
- [ ] Stripe payments are working
- [ ] Admin routes are protected
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] Webhooks are configured in Stripe

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify connection string is correct
- Check database user credentials

**"CORS errors"**
- Update CORS settings in backend
- Add frontend URL to allowed origins
- Redeploy backend

**"Environment variables not working"**
- Double-check variable names (case-sensitive)
- Restart/redeploy after adding variables
- Check for typos

### Frontend Issues

**"API calls failing"**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Check CORS settings

**"Build fails"**
- Check build logs in Vercel/Netlify
- Ensure all dependencies are in package.json
- Check for TypeScript/ESLint errors

**"Stripe not loading"**
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set
- Check Stripe key is correct (live vs test)
- Check browser console for errors

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** (already in .gitignore)
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Use HTTPS** (automatic on Vercel/Netlify/Render)
4. **Restrict CORS** to your frontend domain only
5. **Use environment variables** for all secrets
6. **Keep dependencies updated**
7. **Use MongoDB Atlas IP whitelist** (restrict to backend IP in production)

---

## 📊 Monitoring

### Backend Monitoring (Render)
- View logs: Dashboard → Your Service → Logs
- Monitor uptime and performance
- Set up alerts for downtime

### Frontend Monitoring (Vercel)
- View analytics: Dashboard → Analytics
- Check build logs: Deployments → Click deployment
- Monitor performance: Analytics tab

---

## 🔄 Continuous Deployment

Both Vercel and Render automatically deploy when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Automatic deployment happens!
```

---

## 💰 Cost Estimates

### Free Tier Limits:
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Render**: 750 hours/month free (enough for 1 service)
- **Vercel**: Unlimited bandwidth, 100GB bandwidth/month
- **Stripe**: Pay-as-you-go (2.9% + $0.30 per transaction)

### Paid Options (if needed):
- **Render**: $7/month per service (no sleep, better performance)
- **MongoDB Atlas**: $9/month for M0 cluster (better performance)

---

## 🎉 You're Live!

Your MERN e-commerce application is now deployed and accessible worldwide!

**Next Steps:**
1. Share your live URL
2. Test all features thoroughly
3. Monitor for errors
4. Set up custom domain (optional)
5. Configure analytics (optional)

---

## 📞 Need Help?

- Check platform documentation:
  - [Vercel Docs](https://vercel.com/docs)
  - [Render Docs](https://render.com/docs)
  - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
  - [Stripe Docs](https://stripe.com/docs)

---

## 🎯 Quick Reference

**Backend URL**: `https://your-backend.onrender.com`  
**Frontend URL**: `https://your-project.vercel.app`  
**MongoDB**: MongoDB Atlas cluster  
**Stripe**: Live mode keys  

Good luck with your deployment! 🚀

