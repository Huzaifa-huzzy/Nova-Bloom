# Quick Deployment Checklist 🚀

Follow these steps to deploy your MERN e-commerce app:

## ⚡ Quick Steps

### 1. MongoDB Atlas (5 minutes)
- [ ] Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Create database user (save password!)
- [ ] Whitelist IP: `0.0.0.0/0` (allow all)
- [ ] Copy connection string

### 2. Deploy Backend - Render (10 minutes)
- [ ] Sign up at [render.com](https://render.com)
- [ ] New Web Service → Connect GitHub
- [ ] Settings:
  - Build: `cd backend && npm install`
  - Start: `cd backend && npm start`
- [ ] Add Environment Variables:
  ```
  MONGODB_URI=your_atlas_connection_string
  JWT_SECRET=generate_random_32_char_string
  JWT_EXPIRE=7d
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  NODE_ENV=production
  ```
- [ ] Deploy → Copy backend URL

### 3. Deploy Frontend - Vercel (5 minutes)
- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Import GitHub repo
- [ ] Settings:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Environment Variables:
  ```
  VITE_API_URL=https://your-backend.onrender.com/api
  VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
  ```
- [ ] Deploy → Copy frontend URL

### 4. Update Backend CORS
- [ ] In Render dashboard → Environment Variables
- [ ] Add: `FRONTEND_URL=https://your-frontend.vercel.app`
- [ ] Redeploy backend

### 5. Stripe Webhook
- [ ] Stripe Dashboard → Webhooks
- [ ] Add endpoint: `https://your-backend.onrender.com/api/payments/webhook`
- [ ] Select: `payment_intent.succeeded`
- [ ] Copy webhook secret → Add to backend env vars

### 6. Test
- [ ] Visit frontend URL
- [ ] Register/Login
- [ ] Browse products
- [ ] Add to cart
- [ ] Test checkout (use test card: 4242 4242 4242 4242)

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_32_chars_min
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🎯 Your URLs
- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-project.vercel.app`
- Health Check: `https://your-backend.onrender.com/api/health`

## ✅ Done!
Your app is live! 🎉

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

