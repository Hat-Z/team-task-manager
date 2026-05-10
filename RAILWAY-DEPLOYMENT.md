# Railway Deployment Guide

## Overview
This project has been split into separate Docker images for backend and frontend, optimized for Railway deployment.

## Files
- **Dockerfile.backend** - Backend API server (Node.js/Express)
- **Dockerfile.frontend** - Frontend React app (Static site served with `serve`)
- **railway.json** - Railway configuration (currently configured for backend)

## Deployment Steps

### Backend Service

1. Create a new Railway project
2. Connect your GitHub repository
3. In Railway, click "Create" → "New Service" → "GitHub Repo"
4. Under "Deployment" settings, set:
   - **Build Command**: Leave empty (Docker handles it)
   - **Start Command**: `node dist/server.js`
   - **Dockerfile**: `Dockerfile.backend`
   - **Working Directory**: `.`

5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `NODE_ENV` - Set to `production`
   - Other required variables from your `.env.example`

6. Deploy!

### Frontend Service

1. In the same Railway project, create another service
2. Connect the same repository
3. Under "Deployment" settings, set:
   - **Build Command**: Leave empty (Docker handles it)
   - **Start Command**: `serve -s dist -l 3000`
   - **Dockerfile**: `Dockerfile.frontend`
   - **Working Directory**: `.`

4. Add environment variables:
   - `REACT_APP_API_URL` - Backend API URL (e.g., `https://your-backend.railway.app`)
   - `PORT` - Set to `3000` (optional, Railway will use this)

5. Deploy!

### Environment Variables in Railway

For the **Backend**, the PORT is automatically set by Railway (defaults to 5000). You can verify this works via the health endpoint at `/health`.

For the **Frontend**, Railway will set the PORT environment variable. The app serves on port 3000 by default.

## Multi-Stage Builds

Both Dockerfiles use multi-stage builds for optimization:
- **Build stage**: Installs all dependencies and builds the app
- **Production stage**: Only copies the built artifacts, resulting in much smaller images

## Key Features

✅ **Production-ready**: Minimal image size, no dev dependencies  
✅ **Health checks**: Built-in health monitoring  
✅ **Signal handling**: Uses dumb-init for proper signal forwarding  
✅ **Railway optimized**: Proper PORT environment variable handling  
✅ **Auto-restart**: Configured with restart policies  

## Testing Locally

### Test backend build:
```bash
docker build -f Dockerfile.backend -t team-task-backend .
docker run -p 5000:5000 -e MONGODB_URI="your_db_url" team-task-backend
```

### Test frontend build:
```bash
docker build -f Dockerfile.frontend -t team-task-frontend .
docker run -p 3000:3000 team-task-frontend
```

## Troubleshooting

- **Build fails**: Ensure all environment variables are set in Railway
- **App crashes**: Check logs in Railway's dashboard
- **Health check failing**: Verify the `/health` endpoint exists in your backend
- **Frontend can't reach API**: Check `REACT_APP_API_URL` environment variable
