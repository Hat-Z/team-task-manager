#!/bin/bash

echo "🚀 Building Team Task Manager..."

# Build backend
echo "📦 Building backend..."
cd backend
npm install
npm run build
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "To deploy with Docker:"
echo "  docker-compose up --build"
