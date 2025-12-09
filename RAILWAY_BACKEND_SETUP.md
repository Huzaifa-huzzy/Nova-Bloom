# Railway Backend Deployment Guide 🚂

Complete guide to deploy your Express.js backend to Railway (free tier available).

## 🎯 Why Railway?

- ✅ **Free tier**: $5 credit/month (enough for small projects)
- ✅ **Easy setup**: Connect GitHub, auto-deploys
- ✅ **Fast**: Always-on deployments, no cold starts
- ✅ **Simple**: Great for Express.js backends

## 📋 Prerequisites

1. GitHub repository: `Huzaifa-huzzy/Nova-Bloom` ✅
2. MongoDB Atlas account (free tier available)
3. Stripe account

---

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select **"Huzaifa-huzzy/Nova-Bloom"**
4. Click **"Deploy Now"**

### Step 3: Configure Backend Service

Railway will auto-detect your project. Now configure it:

1. Click on the service that was created
2. Go to **Settings** tab
3. Scroll to **"Root Directory"**
4. Set to: `backend`
5. Click **"Save"**

### Step 4: Add Environment Variables

Go to **Variables** tab and add these:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=production
FRONTEND_URL=https://nova-bloom.vercel.app
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Generate a strong `JWT_SECRET` (minimum 32 characters)
- Get Stripe keys from Stripe Dashboard (Live mode)
- Update `FRONTEND_URL` after deploying frontend to Vercel

### Step 5: Generate Public Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Railway will create a domain like: `your-project-name.up.railway.app`
4. Copy this URL - you'll need it for:
   - Frontend `VITE_API_URL`
   - Stripe webhook endpoint

### Step 6: Verify Deployment

1. Wait 2-5 minutes for deployment to complete
2. Check **Deployments** tab - should show "Active"
3. Visit: `https://your-project-name.up.railway.app/api/health`
4. Should return: `{"status":"OK","message":"Server is running"}`

---

## 🔧 Configuration Details

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<password>` and `<dbname>` in connection string

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live mode**
3. **Developers** → **API keys** → Copy:
   - Publishable key: `pk_live_...` (for frontend)
   - Secret key: `sk_live_...` (for backend)
4. **Developers** → **Webhooks** → Add endpoint:
   - URL: `https://your-project-name.up.railway.app/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret: `whsec_...`

---

## 🔄 Update Frontend After Backend Deployment

Once your backend is live on Railway:

1. Go to Vercel dashboard
2. Your project → **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-project-name.up.railway.app/api
   ```
4. **Deployments** → Latest → **"..."** → **Redeploy**

---

## 📊 Monitoring

### View Logs

1. Railway dashboard → Your service
2. Click **"View Logs"** tab
3. See real-time logs and errors

### Check Deployment Status

- **Deployments** tab shows all deployments
- Green = Active
- Click deployment to see details

---

## 🔄 Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push

# Railway automatically deploys!
```

---

## 💰 Free Tier Limits

Railway gives you **$5 free credit/month**:
- Small projects: Usually free
- Medium traffic: May need to upgrade
- Check usage in Railway dashboard

**Tip**: Monitor your usage in Railway dashboard to stay within free tier.

---

## 🐛 Troubleshooting

### Deployment Fails

**Check logs**:
1. Railway dashboard → Your service → **Logs**
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - MongoDB connection error
   - Build errors

### MongoDB Connection Error

1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (should allow all: `0.0.0.0/0`)
3. Verify database user credentials

### CORS Errors

1. Add `FRONTEND_URL` environment variable in Railway
2. Update backend `server.js` CORS settings
3. Redeploy

### Service Not Starting

1. Check **Logs** tab for errors
2. Verify `PORT` environment variable is set
3. Ensure `npm start` command works locally
4. Check Root Directory is set to `backend`

---

## ✅ Success Checklist

- [ ] Backend deployed on Railway
- [ ] Domain generated: `https://your-project.up.railway.app`
- [ ] Health check works: `/api/health`
- [ ] Environment variables set
- [ ] MongoDB connected
- [ ] Frontend `VITE_API_URL` updated
- [ ] Stripe webhook configured
- [ ] Test API endpoints work

---

## 🎉 Next Steps

After backend is deployed:

1. ✅ Deploy frontend to Vercel (see `VERCEL_DEPLOYMENT.md`)
2. ✅ Update frontend `VITE_API_URL`
3. ✅ Configure Stripe webhook
4. ✅ Test full application

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Railway Pricing](https://railway.app/pricing)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com)

---

Your backend is now live on Railway! 🚂

