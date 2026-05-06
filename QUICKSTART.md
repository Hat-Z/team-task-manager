# Quick Start Guide

Get the Team Task Manager running in 5 minutes!

## Option 1: Run Locally (Development)

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/team-task-manager
# JWT_SECRET=your-secret-key

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App opens at http://localhost:3000
```

### Test It Out

1. Go to http://localhost:3000
2. Click "Sign up"
3. Create an account
4. Create a project
5. Add a task

---

## Option 2: Run with Docker

### Prerequisites
- Docker and Docker Compose

### Start Everything

```bash
# From project root
docker-compose up --build

# Backend: http://localhost:5000
# MongoDB: localhost:27017
# Admin: admin / password

# First time setup:
# 1. Wait for services to be healthy
# 2. Access http://localhost:5000/health to verify backend
```

### Stop Services

```bash
docker-compose down

# Remove all data
docker-compose down -v
```

---

## Option 3: Deploy to Railway (Production)

### Prerequisites
- GitHub account
- Railway account (free at railway.app)
- MongoDB Atlas (free tier available)

### Deploy

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Railway**
   - Go to railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment**
   - Set `MONGODB_URI` from MongoDB Atlas
   - Set `JWT_SECRET` (generate: `openssl rand -hex 32`)
   - Set `NODE_ENV=production`

4. **Deploy**
   - Railway automatically builds and deploys
   - Get your live URLs from Railway dashboard

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Common Tasks

### Create a Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Add Team Member

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"memberId": "USER_ID"}'
```

### Create Task

```bash
curl -X POST http://localhost:5000/api/tasks/PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Task Title",
    "description": "Description",
    "assignedTo": "USER_ID",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

### Update Task Status

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "in_progress"}'
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 PID
```

### MongoDB Connection Error

- Verify connection string in .env
- Check MongoDB is running: `mongo` or `mongosh`
- For Atlas: ensure IP whitelist allows 0.0.0.0/0

### Frontend Can't Connect to Backend

- Check backend is running on http://localhost:5000
- Verify VITE_API_URL in frontend .env
- Check browser console for CORS errors

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
rm -rf dist
npm run build
```

---

## Default Test Account

After first deployment, create an account:
- Email: test@example.com
- Password: test123456
- Name: Test User

---

## File Structure

```
team-task-manager/
├── backend/              # Node.js/Express API
├── frontend/             # React app
├── README.md             # Full documentation
├── DEPLOYMENT.md         # Railway deployment guide
├── QUICKSTART.md         # This file
├── docker-compose.yml    # Docker setup
└── Dockerfile            # Container configuration
```

---

## Next Steps

1. ✅ Run locally to test
2. ✅ Create sample projects and tasks
3. ✅ Explore the dashboard
4. ✅ Test with team members
5. ✅ Deploy to Railway
6. ✅ Share with your team

---

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Check backend logs: `docker-compose logs backend`
- Check MongoDB: `docker-compose logs mongodb`

---

**Happy Task Managing! 🚀**
