@echo off
REM K50 Attendance Hub - Development Startup Script for Windows
REM Starts both frontend (Vite) and backend (K50 Sync Service) simultaneously

setlocal enabledelayedexpansion

echo ╔════════════════════════════════════════╗
echo ║  K50 Attendance Hub - Development      ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist ".env" (
  echo Error: .env file not found!
  echo Please create .env file with K50 device configuration.
  echo See K50_SETUP.md for instructions.
  pause
  exit /b 1
)

echo Configuration:
findstr /i "K50_DEVICE_IP K50_DEVICE_PORT VITE_SUPABASE_URL" .env
echo.

REM Check if server node_modules exists
if not exist "server\node_modules" (
  echo Installing server dependencies...
  cd server
  call npm install
  cd ..
  echo.
)

echo Starting services...
echo.

REM Start frontend
echo ^> Starting Frontend (Vite)...
start "K50 Frontend" npm run dev
timeout /t 2 /nobreak

REM Start backend
echo ^> Starting K50 Sync Service...
start "K50 Sync Service" npm run sync:dev

echo.
echo ^✓ Services started!
echo.
echo Frontend: http://localhost:5173
echo Sync Service: Running in background
echo.
echo Close the terminal windows to stop services
echo.
pause
