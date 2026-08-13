import mysql.connector


def get_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Kavya@123google",
        database="food_fiesta"
    )

    return connection