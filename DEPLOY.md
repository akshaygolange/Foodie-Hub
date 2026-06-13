# Foodie-Hub Deployment Guide

## Required Environment Variables

Before deploying, set these environment variables in your hosting platform:

### Backend (.env or hosting dashboard)
- **`MONGO_URI`** (required): MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
  - Get from MongoDB Atlas or your DB provider
  
- **`CLIENT_URL`** (required): Frontend URL(s) for CORS
  - Example: `https://your-frontend.vercel.app`
  - Multiple URLs: `https://frontend1.com,https://frontend2.com`
  
- **`PORT`** (optional): Server port (defaults to 5000)
  - Example: `5000`

### Frontend (.env.local or environment variables)
- **`VITE_API_URL`** (if needed): Backend API URL
  - Example: `https://your-backend.herokuapp.com`

## Hosting Recommendations

### Backend (Node.js + Express + Socket.IO)
**⚠️ Important:** Vercel Functions are serverless and don't support long-lived Socket.IO connections. Use:
- [Render](https://render.com) — Free tier available, auto-deploys from GitHub
- [Railway](https://railway.app) — Simple, pay-as-you-go
- [Heroku](https://heroku.com) — No free tier anymore, but reliable
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
- Docker + any cloud provider

### Frontend (React + Vite)
- [Vercel](https://vercel.com) — Optimized for Next.js but works great with Vite
- [Netlify](https://netlify.com) — Drag-and-drop deployments
- [GitHub Pages](https://pages.github.com) — Free, static sites only

## Deployment Steps

### 1. Prepare Repository
```bash
# Remove committed env files (if not done already)
git rm --cached backend/.env backend/.env.production 2>/dev/null || true
git commit -m "Remove committed .env files"
git push
```

### 2. Deploy Backend (Render Example)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Select `backend` as root directory
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add environment variables:
   - `MONGO_URI` = your MongoDB connection string
   - `CLIENT_URL` = your frontend URL (e.g., `https://your-frontend.vercel.app`)
8. Deploy

### 3. Deploy Frontend (Vercel Example)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Select `frontend` as root directory
5. Environment: `Vite / React` (auto-detected)
6. Deploy
7. After deployment, update backend's `CLIENT_URL` to match the Vercel URL

### 4. Local Development Setup
```bash
# Backend
cp backend/.env.sample backend/.env
# Edit backend/.env and set MONGO_URI

# Install dependencies
cd backend
npm install
npm run dev

# In another terminal: Frontend
cd frontend
npm install
npm run dev
```

## Troubleshooting

### 500 Error: Database is not connected
- **Cause:** `MONGO_URI` environment variable not set
- **Fix:** Set `MONGO_URI` in your hosting dashboard

### CORS errors
- **Cause:** Frontend URL not in `CLIENT_URL`
- **Fix:** Update backend's `CLIENT_URL` environment variable

### Socket.IO connection fails
- **Cause:** Backend served on Vercel Functions (serverless)
- **Fix:** Use Render, Railway, or Heroku instead (supports persistent connections)

## Quick Checklist
- [ ] MongoDB connection string ready
- [ ] Backend environment variables set in hosting dashboard
- [ ] Frontend deployed and URL noted
- [ ] Backend's `CLIENT_URL` updated to match frontend URL
- [ ] Test login on deployed site
- [ ] Check browser console and Render/Railway logs for errors

## Getting Help
- Check backend logs on hosting platform dashboard
- Check frontend errors in browser DevTools console
- Verify all environment variables are set correctly
