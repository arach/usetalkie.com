#!/bin/bash

# Development launcher for Talkie
# Starts both the main site and marketing API

# Load config
source "$(dirname "$0")/dev.config.sh"

echo "🚀 Starting Talkie development environment..."
echo ""
echo "📍 Main site:      ${MAIN_URL}"
echo "📍 Marketing API:  ${MARKETING_URL}"
echo ""

# Kill any existing processes on these ports
lsof -ti:${MAIN_PORT} | xargs kill -9 2>/dev/null
lsof -ti:${MARKETING_PORT} | xargs kill -9 2>/dev/null

# Start marketing API in background
echo "Starting marketing API..."
cd marketing-api && bun dev > ../logs/marketing-api.log 2>&1 &
MARKETING_PID=$!

# Wait a moment for marketing API to start
sleep 2

# Start main site
echo "Starting main site..."
cd .. && bun dev

# Cleanup on exit
trap "kill $MARKETING_PID 2>/dev/null" EXIT
