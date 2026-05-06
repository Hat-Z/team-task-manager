# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## 🚀 Features

- **Authentication**: User signup and login with JWT
- **Project Management**: Create, update, delete projects and manage team members
- **Task Management**: Create, assign, and track tasks with priorities and due dates
- **Dashboard**: Overview of tasks with statistics and overdue alerts
- **Role-Based Access**: Admin and Member roles with appropriate permissions
- **Real-time Updates**: Live task status tracking
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Lucide React Icons

## 📋 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth and validation middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   └── server.ts        # Express app entry
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB instance (local or cloud: MongoDB Atlas)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
# JWT_SECRET=your_secret_key_here
# PORT=5000

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Project Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members` - Remove member from project

### Task Endpoints

- `GET /api/tasks/dashboard` - Get user dashboard
- `GET /api/tasks/:projectId` - Get project tasks
- `POST /api/tasks/:projectId` - Create task
- `GET /api/tasks/task/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔐 User Roles

### Admin
- Full access to all features
- Manage all users
- Create and manage projects
- Assign and track tasks

### Member
- Create and manage own projects
- Participate in team projects
- Create and update assigned tasks
- View project dashboard

## 🌐 Deployment on Railway

### Step 1: Prepare your repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Connect to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up or log in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

### Step 3: Configure Environment Variables
In Railway dashboard:
- Set `MONGODB_URI` to your MongoDB connection string
- Set `JWT_SECRET` to a secure random string
- Set `CORS_ORIGIN` to your frontend URL
- Set `NODE_ENV` to `production`

### Step 4: Deploy Backend
1. In Railway, create a new service
2. Select "Node.js" as the runtime
3. Connect your GitHub repository
4. Set the start command: `npm run build && npm start`

### Step 5: Deploy Frontend
1. Create another service for frontend
2. Build command: `npm run build`
3. Start command: `npm run preview`
4. Set environment variable `VITE_API_URL` to your backend URL

### Step 6: Connect Services
- Link backend and frontend services
- Configure CORS in backend to accept frontend URL
- Update frontend API URL to point to backend

## 🧪 Testing

### Create Test User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Create Test Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Project","description":"A test project"}'
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔄 Workflow

1. **Sign Up**: Create a new account
2. **Create Project**: Start a new project
3. **Manage Team**: Add team members to your project
4. **Create Tasks**: Assign tasks to team members
5. **Track Progress**: Monitor task status on the dashboard
6. **Complete Tasks**: Update task status and mark as complete

## 🎯 Future Enhancements

- [ ] Task comments and activity log
- [ ] File attachments
- [ ] Team notifications
- [ ] Advanced filtering and search
- [ ] Task history and version control
- [ ] Export reports (PDF, CSV)
- [ ] Calendar view
- [ ] Integration with third-party tools
- [ ] Mobile app
- [ ] Real-time collaboration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Task Managing! 🚀**
