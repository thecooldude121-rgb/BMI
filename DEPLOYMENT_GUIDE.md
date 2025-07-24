# BMI Platform Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended for Next.js-like apps)
1. Push code to GitHub repository
2. Connect GitHub to Vercel (vercel.com)
3. Import your repository
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy automatically

### Option 2: Railway (Great for full-stack apps)
1. Push code to GitHub
2. Connect to Railway (railway.app)
3. Create new project from GitHub repo
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy with one click

### Option 3: Render (Free tier available)
1. Push code to GitHub
2. Connect to Render (render.com)
3. Create new web service
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy

### Option 4: Export and Manual Deploy
1. Download/export this Replit project
2. Upload to any cloud provider
3. Use the provided Dockerfile for containerized deployment

## Environment Variables Required
- `GEMINI_API_KEY`: Your Google Gemini API key
- `DATABASE_URL`: PostgreSQL connection string (for production)
- `NODE_ENV`: Set to "production"

## Build Commands
- Build: `npm run build`
- Start: `npm run start`
- Dev: `npm run dev`

## Health Check Endpoint
- `/health` - Returns application status

Your BMI Platform includes:
✅ CRM System
✅ HRMS Management  
✅ Meeting Intelligence with Google Gemini AI
✅ Analytics Dashboard
✅ Gamification Features

All modules are fully integrated and ready for production deployment.