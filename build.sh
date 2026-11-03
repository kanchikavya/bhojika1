#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# 1. Build React Frontend
echo "Building React Frontend..."
cd frontend-react
npm install
npm run build
cd ..

# 2. Setup Django Backend
echo "Setting up Python Backend..."
cd backend
pip install -r requirements.txt
python manage.py collectstatic --no-input
cd ..

echo "Build complete! Unified service ready."
