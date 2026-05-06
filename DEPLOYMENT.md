# Deployment Guide - Team Task Manager

This guide will walk you through deploying the Team Task Manager application to Railway.app.

## Prerequisites

1. **GitHub Account** - To push your code
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **MongoDB Atlas Account** (Optional) - For hosted MongoDB, or use Railway's PostgreSQL
4. **Git** - For version control

## Step 1: Prepare Your Repository

### Local Setup

```bash
# Navigate to the project root
cd team-task-manager

# Initialize git if not already done
git init

# Create a .gitignore file (already provided)
# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Team Task Manager full-stack app"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Environment Configuration

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=generate_a_secure_random_string_here
CORS_ORIGIN=https://your-frontend-url.railway.app
NODE_ENV=production
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace `<dbname>` with `team-task-manager`

Example connection string:
```
mongodb+srv://admin:mypassword@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

### Option B: Use Railway PostgreSQL

1. In Railway, create a PostgreSQL database service
2. Use connection string provided by Railway
3. Note: Requires schema migration from MongoDB

## Step 3: Deploy on Railway

### Step 3.1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize GitHub access
5. Select your `team-task-manager` repository
6. Click "Deploy"

### Step 3.2: Configure Backend Service

Railway will automatically detect Node.js and create a service.

**Configure environment variables:**

1. In Railway dashboard, go to your project
2. Click on the backend service
3. Go to "Variables" tab
4. Add the following variables:

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a secure random string: `openssl rand -hex 32` |
| `CORS_ORIGIN` | Leave empty initially, update after frontend deployment |
| `NODE_ENV` | `production` |

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

### Step 3.3: Get Backend URL

1. Once backend deployment completes, go to "Settings"
2. Note the generated Railway domain (e.g., `https://team-task-manager-backend-production.railway.app`)
3. Update `CORS_ORIGIN` variable with this URL

### Step 3.4: Deploy Frontend

1. In Railway, click "New Service"
2. Select "GitHub repo" → your repository
3. Railway will detect `package.json` in frontend

**Configure Frontend Service:**

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Start Command | `npm run preview` |
| Port | `3000` |

**Add Environment Variables:**

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend-url.railway.app/api` |

### Step 3.5: Connect Services

1. In Railway, go to "Connect"
2. Link backend and frontend services
3. Update backend's `CORS_ORIGIN` to frontend URL

## Step 4: Testing Deployment

### Check Backend Health

```bash
curl https://your-backend-url.railway.app/health
```

Response should be:
```json
{"status":"OK","message":"Server is running"}
```

### Test API Endpoints

**Create Account:**
```bash
curl -X POST https://your-backend-url.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Access Application

Open browser and visit: `https://your-frontend-url.railway.app`

1. Sign up or login
2. Create a project
3. Add team members
4. Create tasks
5. Verify dashboard

## Step 5: Monitoring

### View Logs

1. In Railway dashboard, select the service
2. Go to "Logs" tab
3. Monitor for errors

### Performance Monitoring

- Check memory usage
- Monitor CPU utilization
- Watch for database connection errors

## Step 6: Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically builds and deploys
```

To disable auto-deploy:
1. Go to Service Settings
2. Uncheck "Auto Deploy"

## Troubleshooting

### Backend Not Starting

**Check logs:**
1. Go to Railway dashboard
2. Click backend service
3. View "Logs" tab

**Common Issues:**
- Missing environment variables
- Invalid MongoDB URI
- Port already in use
- Dependencies not installed

### Frontend Not Connecting to Backend

1. Verify backend URL in frontend `.env`
2. Check CORS settings in backend
3. Ensure backend is running (check health endpoint)

### Database Connection Error

1. Verify MongoDB URI is correct
2. Check MongoDB Atlas IP whitelist (should allow all: 0.0.0.0/0)
3. Ensure database name matches connection string

### Static Files Not Found

1. Ensure frontend is built (`npm run build`)
2. Check `public` directory in build output
3. Verify build command in Railway settings

## Production Checklist

- [ ] Generate secure JWT_SECRET (`openssl rand -hex 32`)
- [ ] Set NODE_ENV to `production`
- [ ] Enable MongoDB backups
- [ ] Set up MongoDB IP whitelist
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Set up monitoring/alerts
- [ ] Test all features
- [ ] Set up error logging
- [ ] Document admin credentials

## Scaling

### Horizontal Scaling

1. Go to Service Settings
2. Increase "Instance Count"
3. Railway automatically load balances

### Database Scaling

For MongoDB Atlas:
1. Upgrade cluster tier
2. Add sharding for large datasets
3. Configure read replicas

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable MongoDB authentication**
4. **Use HTTPS** (automatic on Railway)
5. **Implement rate limiting** on APIs
6. **Validate all inputs** (already done with express-validator)
7. **Use environment variables** for sensitive data
8. **Regular security updates** for dependencies

## Backup Strategy

### Database Backups

**MongoDB Atlas:**
1. Enable automatic backups (default: daily)
2. Set backup retention (default: 7 days)
3. Test restore procedures

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/team-task-manager" --out=/backup
```

## Cost Estimation

**Railway Free Tier:**
- $5 credit/month
- Suitable for development/testing

**Estimated Production Costs:**
- Backend: $7-20/month
- Frontend: $7-20/month
- MongoDB Atlas: Free tier or $10+/month

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Test features
4. ✅ Set up monitoring
5. ✅ Configure backups
6. ✅ Document procedures
7. ✅ Share with team

## Support

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Help](https://docs.atlas.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)

---

**Happy Deploying! 🚀**
