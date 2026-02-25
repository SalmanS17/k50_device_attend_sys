#!/bin/bash

# K50 Attendance Hub - Development Startup Script
# Starts both frontend (Vite) and backend (K50 Sync Service) simultaneously

set -e

echo "╔════════════════════════════════════════╗"
echo "║  K50 Attendance Hub - Development      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
  echo -e "${RED}Error: .env file not found!${NC}"
  echo "Please create .env file with K50 device configuration."
  echo "See K50_SETUP.md for instructions."
  exit 1
fi

echo -e "${YELLOW}Configuration:${NC}"
grep "K50_DEVICE_IP\|K50_DEVICE_PORT\|VITE_SUPABASE_URL" .env
echo ""

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
  echo -e "${YELLOW}Installing server dependencies...${NC}"
  cd server && npm install && cd ..
  echo ""
fi

# Start services
echo -e "${GREEN}Starting services...${NC}"
echo ""

# Start frontend in background
echo -e "${YELLOW}▶ Starting Frontend (Vite)...${NC}"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

# Wait a moment for frontend to start
sleep 2

# Start backend in background
echo -e "${YELLOW}▶ Starting K50 Sync Service...${NC}"
npm run sync:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

echo ""
echo -e "${GREEN}✓ Services started!${NC}"
echo ""
echo "Frontend: http://localhost:5173"
echo "Sync Service: Running in background"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "  Frontend:  tail -f /tmp/frontend.log"
echo "  Backend:   tail -f /tmp/backend.log"
echo ""
echo -e "${YELLOW}To stop, press Ctrl+C${NC}"
echo ""

# Handle Ctrl+C gracefully
cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down...${NC}"
  kill $FRONTEND_PID 2>/dev/null || true
  kill $BACKEND_PID 2>/dev/null || true
  wait 2>/dev/null || true
  echo -e "${GREEN}✓ Services stopped${NC}"
}

trap cleanup EXIT INT TERM

# Wait for both processes
wait
