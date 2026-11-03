@echo off
echo Starting Food Fiesta Django REST API Backend on http://localhost:8000 ...
cd backend
python manage.py runserver 0.0.0.0:8000
pause
