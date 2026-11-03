@echo off
echo ========================================================
echo Starting Food Fiesta - Full Stack Restaurant System
echo Django REST Framework + MySQL + React 19 Single Page App
echo ========================================================

start "Food Fiesta - Django API" cmd /c "run_backend.bat"
timeout /t 2 >nul
start "Food Fiesta - React App" cmd /c "run_frontend.bat"

echo.
echo Backend API: http://localhost:8000/api/
echo React App:   http://localhost:5173/
echo Static HTML: http://localhost:8000/static/ or open index.html
echo ========================================================
