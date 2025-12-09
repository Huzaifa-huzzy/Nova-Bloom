# Quick Vercel Deployment Checklist ⚡

## Frontend → Vercel (5 minutes)

- [ ] Sign up at [vercel.com](https://vercel.com) (use GitHub)
- [ ] Click "Add New Project"
- [ ] Import: `Huzaifa-huzzy/Nova-Bloom`
- [ ] Settings:
  - Root Directory: `frontend` ⚠️
  - Framework: Vite (auto)
  - Build: `npm run build`
  - Output: `dist`
- [ ] Environment Variables:
  ```
  VITE_API_URL=https://your-backend.onrender.com/api
  VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
  ```
- [ ] Click "Deploy"
- [ ] Copy frontend URL: `https://nova-bloom.vercel.app`

## Backend → Railway (10 minutes)

- [ ] Sign up at [railway.app](https://railway.app) (use GitHub)
- [ ] New Project → Deploy from GitHub → Select repo
- [ ] Settings → Root Directory: `backend`
- [ ] Settings → Variables → Add Environment Variables:
  ```
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=your_secret_32_chars
  JWT_EXPIRE=7d
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  NODE_ENV=production
  FRONTEND_URL=https://nova-bloom.vercel.app
  ```
- [ ] Railway auto-deploys → Settings → Networking → Generate Domain
- [ ] Copy backend URL: `https://your-project.up.railway.app`
- [ ] Update Vercel `VITE_API_URL` → Redeploy frontend

## Stripe Setup (5 minutes)

- [ ] Stripe Dashboard → Live mode
- [ ] Copy keys → Add to Vercel & Render
- [ ] Webhook: `https://your-project.up.railway.app/api/payments/webhook`
- [ ] Copy webhook secret → Add to Railway

## Test ✅

- [ ] Frontend loads: `https://nova-bloom.vercel.app`
- [ ] Backend health: `https://your-project.up.railway.app/api/health`
- [ ] Register/Login works
- [ ] Products load
- [ ] Cart works
- [ ] Checkout works (test card: 4242 4242 4242 4242)

## 🎉 Done!

Your app is live! 🚀

For detailed instructions, see `VERCEL_DEPLOYMENT.md`

