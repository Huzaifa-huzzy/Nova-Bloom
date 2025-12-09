# Vercel Full Stack Deployment Checklist ✅

## Pre-Deployment

- [x] Backend converted to Vercel serverless functions (`api/` directory)
- [x] MongoDB connection utility created (`api/db.js`)
- [x] All API routes converted to serverless functions
- [x] Frontend API URL configured to use environment variable
- [x] `vercel.json` configured correctly
- [x] Root `package.json` created with dependencies

## Environment Variables Needed

Add these in Vercel dashboard:

### Required
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secret key for JWT (min 32 chars)
- [ ] `JWT_EXPIRE` - JWT expiration (default: `7d`)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (`sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (`whsec_...`)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `VITE_API_URL` - Your Vercel API URL (`https://your-project.vercel.app/api`)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (`pk_live_...`)

## Deployment Steps

1. [ ] Push code to GitHub
   ```bash
   git add .
   git commit -m "Convert backend to Vercel serverless functions"
   git push origin main
   ```

2. [ ] Go to [vercel.com](https://vercel.com)
3. [ ] Import project from GitHub
4. [ ] Configure build settings:
   - Root Directory: (leave empty)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd backend && npm install && cd ../frontend && npm install`
5. [ ] Add all environment variables
6. [ ] Deploy
7. [ ] After first deploy, update `VITE_API_URL` with your actual Vercel URL
8. [ ] Redeploy
9. [ ] Set up Stripe webhook with your Vercel URL
10. [ ] Test all endpoints

## Post-Deployment Testing

- [ ] Frontend loads: `https://your-project.vercel.app`
- [ ] API health check: `https://your-project.vercel.app/api/health`
- [ ] User registration works
- [ ] User login works
- [ ] Products load
- [ ] Cart functionality works
- [ ] Checkout works
- [ ] Stripe payment works
- [ ] Admin routes work (if applicable)

## Troubleshooting

### Build fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Check environment variables are set

### API routes return 404
- Verify files are in `api/` directory
- Check file names match route structure
- Ensure `vercel.json` rewrites are correct

### MongoDB connection fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### CORS errors
- Check CORS headers in API functions
- Verify frontend URL matches Vercel domain

## Project Structure

```
Demo-Mern/
├── api/                    # Vercel serverless functions
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   └── db.js
├── backend/
│   ├── models/            # Shared models
│   └── middleware/
├── frontend/              # React/Vite app
│   ├── src/
│   └── dist/              # Build output
├── vercel.json            # Vercel config
└── package.json          # Root dependencies
```

## Quick Reference

- **Frontend URL**: `https://your-project.vercel.app`
- **API Base URL**: `https://your-project.vercel.app/api`
- **Health Check**: `https://your-project.vercel.app/api/health`

For detailed instructions, see:
- `QUICK_VERCEL_FULL_DEPLOY.md` - Quick 5-minute guide
- `VERCEL_FULL_DEPLOYMENT.md` - Complete detailed guide

