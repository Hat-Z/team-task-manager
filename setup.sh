#!/bin/bash

# This script sets up the application for Railway deployment

echo "Setting up Team Task Manager for Railway deployment..."

# Create necessary directories
mkdir -p backend/dist
mkdir -p frontend/dist

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env - Please update with your configuration"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "Created frontend/.env - Please update with your configuration"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT_SECRET"
echo "2. Update frontend/.env with your backend API URL"
echo "3. Commit changes and push to GitHub"
echo "4. Connect your repository to Railway.app"
echo ""
echo "For more information, see README.md"
