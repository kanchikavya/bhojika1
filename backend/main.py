from http.server import HTTPServer, BaseHTTPRequestHandler
import json

from database import get_connection



class FoodServer(BaseHTTPRequestHandler):


    def do_GET(self):

        if self.path == "/users":


            connection = get_connection()

            cursor = connection.cursor(dictionary=True)


            cursor.execute(
                "SELECT * FROM users"
            )


            users = cursor.fetchall()


            self.send_response(200)


            # self.send_response(200)

            self.send_header(
                "Content-type",
                    "application/json"
            )

            self.send_header(
            "Access-Control-Allow-Origin",
                "*"
            )

            self.end_headers()


            self.wfile.write(
                json.dumps(users).encode()
            )


            cursor.close()
            connection.close()



server = HTTPServer(
    ("localhost",5000),
    FoodServer
)


print("Server running on port 5000")


server.serve_forever()