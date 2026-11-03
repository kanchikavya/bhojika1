import os
import pymysql


def get_connection():
    """
    Returns a MySQL connection configured from environment variables or defaults.
    """
    return pymysql.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", "Kavya@123google"),
        database=os.environ.get("DB_NAME", "food_fiesta"),
        port=int(os.environ.get("DB_PORT", 3306)),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )
