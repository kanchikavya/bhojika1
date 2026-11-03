"""
Food Fiesta - MySQL Database Initializer & Health Checker
Run this script to verify the connection or import the schema and seed data from food_fiesta.sql.
"""

import os
import pymysql

DB_NAME = os.environ.get('DB_NAME', 'food_fiesta')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Kavya@123google')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = int(os.environ.get('DB_PORT', 3306))


def verify_or_init():
    print(f"Connecting to MySQL server at {DB_HOST}:{DB_PORT} as {DB_USER}...")
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Connected to MySQL server successfully!")
    except Exception as e:
        print(f"Failed to connect to MySQL: {e}")
        return False

    with conn.cursor() as cur:
        cur.execute("SHOW DATABASES")
        dbs = [row['Database'] for row in cur.fetchall()]
        print(f"Existing databases: {dbs}")

        if DB_NAME not in dbs:
            print(f"Database '{DB_NAME}' does not exist. Creating...")
            cur.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"Database '{DB_NAME}' created.")

        cur.execute(f"USE {DB_NAME}")
        cur.execute("SHOW TABLES")
        tables = [list(row.values())[0] for row in cur.fetchall()]
        print(f"Tables in '{DB_NAME}': {tables}")

        required = ['user1', 'orders1', 'returns1', 'complaint1', 'feedback1', 'payments1', 'refund1', 'status1', 'order_logs']
        missing = [t for t in required if t not in tables]

        if missing:
            print(f"Missing tables: {missing}. Applying food_fiesta.sql...")
            sql_file = os.path.join(os.path.dirname(__file__), 'food_fiesta.sql')
            if not os.path.exists(sql_file):
                sql_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'food_fiesta.sql')

            if os.path.exists(sql_file):
                with open(sql_file, 'r', encoding='utf-8') as f:
                    statements = f.read().split(';')
                    for stmt in statements:
                        cleaned = stmt.strip()
                        if cleaned and not cleaned.startswith('--') and not cleaned.startswith('delimiter'):
                            try:
                                cur.execute(cleaned)
                            except Exception as ex:
                                pass
                conn.commit()
                print("Applied food_fiesta.sql statements.")
            else:
                print(f"Warning: {sql_file} not found.")
        else:
            print("All required tables are present and ready!")

    conn.close()
    return True


if __name__ == '__main__':
    verify_or_init()
