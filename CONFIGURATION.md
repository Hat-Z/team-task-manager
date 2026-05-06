# Team Task Manager - Project Configuration Guide

## Environment Variables

### Backend Configuration (backend/.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/team-task-manager

# Authentication
JWT_SECRET=your_jwt_secret_key_here_generate_with_openssl_rand_hex_32

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration (frontend/.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## Development Environment

### MongoDB Local Setup

**On macOS (using Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**On Ubuntu/Debian:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**On Windows:**
```bash
choco install mongodb
```

Or use Docker:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0
```

### JWT Secret Generation

Generate a secure JWT secret:

**On macOS/Linux:**
```bash
openssl rand -hex 32
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

Or use an online generator: https://generate-random.org/encryption-key-generator

### Development Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Running in Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 (Optional) - MongoDB:**
```bash
mongosh  # to connect to MongoDB
```

## Production Environment

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user credentials
4. Whitelist your IP address
5. Get connection string:

```
mongodb+srv://username:password@cluster-name.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

### Production Environment Variables

**Backend (.env for production):**
```env
PORT=5000
NODE_ENV=production

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority

JWT_SECRET=your_secure_secret_key_at_least_32_characters

CORS_ORIGIN=https://your-frontend-domain.railway.app
```

**Frontend (.env for production):**
```env
VITE_API_URL=https://your-api-domain.railway.app/api
```

## Docker Configuration

### Docker Compose Environment

The `docker-compose.yml` automatically sets up:
- MongoDB service
- Backend service  
- Network configuration

To customize:

```yaml
environment:
  PORT: 5000
  MONGODB_URI: mongodb://admin:password@mongodb:27017/team-task-manager
  JWT_SECRET: your_secret_key
  CORS_ORIGIN: http://localhost:3000
  NODE_ENV: development
```

## Railway Deployment Configuration

### Required Environment Variables

```
PORT=5000
NODE_ENV=production
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<generate_secure_secret>
CORS_ORIGIN=<your_frontend_railway_url>
```

### Build and Start Commands

**Backend:**
- Build: `npm run build`
- Start: `npm start`

**Frontend:**
- Build: `npm run build`
- Start: `npm run preview`

## Security Considerations

### Development
- ✅ Use weak secrets for local development
- ✅ Allow localhost for CORS
- ✅ Use local MongoDB

### Production
- ❌ Never commit .env files
- ✅ Use strong, random JWT_SECRET (min 32 characters)
- ✅ Use MongoDB Atlas with authentication
- ✅ Whitelist specific CORS origins
- ✅ Enable HTTPS (automatic with Railway)
- ✅ Use environment variables for all secrets
- ✅ Keep dependencies updated

## Troubleshooting Configuration

### Port Already in Use

**Find and kill process:**
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Issues

Check connection string format:
```
mongodb://[username:password@]host[:port][/[database][?options]]
```

Common issues:
- Wrong password in connection string
- IP not whitelisted (MongoDB Atlas)
- MongoDB service not running
- Wrong database name

### CORS Issues

Frontend can't connect to backend:
1. Check `CORS_ORIGIN` in backend .env
2. Verify backend is running on port 5000
3. Check browser console for error details
4. Ensure `VITE_API_URL` is correct in frontend

## Configuration Validation

### Validate Backend Config

```bash
cd backend
npm run build  # Will catch TypeScript errors
```

### Validate Frontend Config

```bash
cd frontend
npm run build  # Will catch TypeScript and build errors
```

### Test API Connection

```bash
# If backend is running
curl http://localhost:5000/health
# Should return: {"status":"OK","message":"Server is running"}
```

## Reference

- [Express.js Configuration](https://expressjs.com/en/api/app.html)
- [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [React Environment Variables](https://vitejs.dev/guide/env-and-modes.html)

---

**Questions?** Check README.md or DEPLOYMENT.md for more details.
