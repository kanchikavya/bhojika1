#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

pip install -r requirements.txt
python create_seed_db.py
python manage.py collectstatic --no-input
