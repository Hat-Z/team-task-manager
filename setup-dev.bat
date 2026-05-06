@echo off
REM Team Task Manager - Windows Setup Script

echo 🚀 Team Task Manager Setup
echo ==========================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install from https://nodejs.org
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Setup Backend
echo 📦 Setting up backend...
cd backend

if not exist "node_modules" (
    call npm install
) else (
    echo    Backend dependencies already installed
)

if not exist ".env" (
    copy .env.example .env
    echo    ⚠️  Created .env file - please update it
) else (
    echo    ✅ .env file exists
)

echo    ✅ Backend setup complete
echo.

REM Setup Frontend
echo 📦 Setting up frontend...
cd ..\frontend

if not exist "node_modules" (
    call npm install
) else (
    echo    Frontend dependencies already installed
)

if not exist ".env" (
    copy .env.example .env
    echo    ⚠️  Created .env file - please update if needed
) else (
    echo    ✅ .env file exists
)

echo    ✅ Frontend setup complete
echo.

cd ..

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with MongoDB URI and JWT_SECRET
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
