#!/usr/bin/env bash
# start.sh for Railpack
# Install all dependencies and start backend and frontend services

# Exit on any error
set -e

# Install dependencies for both frontend and backend
npm run install-all

# Start backend and frontend concurrently (as background processes)
npm run dev-backend &
npm run dev-frontend &

# Wait for both processes (optional)
wait
