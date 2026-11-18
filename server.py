import os
import http.server
import socketserver

PORT = int(os.environ.get("PORT", 10000))
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server successfully started on port {PORT} serving {ROOT_DIR}")
        httpd.serve_forever()
