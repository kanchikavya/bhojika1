#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# 1. Build React 19 Frontend
echo "Building React 19 Frontend..."
cd frontend-react
npm install
npm run build
cd ..

# 2. Setup Python Backend Dependencies & Seed DB
echo "Setting up Python Backend..."
cd backend
pip install -r requirements.txt
python create_seed_db.py
python manage.py collectstatic --no-input
cd ..

echo "Build complete! Unified service ready to serve."
