#!/bin/bash

# Team Task Manager - Setup Script
# This script sets up the application for development or production

set -e

echo "🚀 Team Task Manager Setup"
echo "=========================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "   ⚠️  Created .env file - please update it with your configuration"
else
    echo "   ✅ .env file exists"
fi

echo "   ✅ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Frontend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "   ⚠️  Created .env file - please update if needed"
else
    echo "   ✅ .env file exists"
fi

echo "   ✅ Frontend setup complete"
echo ""

# Back to root
cd ..

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with MongoDB URI and JWT_SECRET"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For more info, see README.md and QUICKSTART.md"
