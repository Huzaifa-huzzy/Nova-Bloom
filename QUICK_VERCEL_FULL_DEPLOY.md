# Quick Vercel Full Stack Deployment ⚡

Deploy both frontend and backend to Vercel in minutes!

## ✅ Step 1: Prepare MongoDB & Stripe (5 min)

- [ ] MongoDB Atlas: Create cluster → Get connection string
- [ ] Stripe: Get Live keys (`pk_live_...`, `sk_live_...`)

## ✅ Step 2: Deploy to Vercel (5 min)

- [ ] Go to [vercel.com](https://vercel.com) → Sign up with GitHub
- [ ] "Add New Project" → Import `Huzaifa-huzzy/Nova-Bloom`
- [ ] Settings:
  - Root Directory: Leave empty (root)
  - Build: `cd frontend && npm install && npm run build`
  - Output: `frontend/dist`
  - Install: `cd backend && npm install && cd ../frontend && npm install`
- [ ] Environment Variables (add all):
  ```
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=your_secret_32_chars_min
  JWT_EXPIRE=7d
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_... (add after webhook setup)
  NODE_ENV=production
  VITE_API_URL=https://your-project.vercel.app/api
  VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
  ```
- [ ] Click "Deploy"

## ✅ Step 3: Update After First Deploy (2 min)

- [ ] Copy your Vercel URL: `https://your-project.vercel.app`
- [ ] Update `VITE_API_URL` in Vercel env vars
- [ ] Redeploy

## ✅ Step 4: Stripe Webhook (3 min)

- [ ] Stripe Dashboard → Webhooks → Add endpoint
- [ ] URL: `https://your-project.vercel.app/api/payments/webhook`
- [ ] Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Copy webhook secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`
- [ ] Redeploy

## ✅ Step 5: Test

- [ ] Frontend: `https://your-project.vercel.app`
- [ ] API Health: `https://your-project.vercel.app/api/health`
- [ ] Register/Login
- [ ] Browse products
- [ ] Test checkout

## 🎉 Done!

Everything is on Vercel! 🚀

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/*`

For detailed guide, see `VERCEL_FULL_DEPLOYMENT.md`

