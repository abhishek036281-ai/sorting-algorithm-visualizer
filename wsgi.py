import os
import mimetypes

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def application(environ, start_response):
    req_path = environ.get('PATH_INFO', '/').lstrip('/')
    if not req_path or req_path == '/':
        req_path = 'index.html'
    
    file_path = os.path.join(BASE_DIR, req_path)
    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        file_path = os.path.join(BASE_DIR, 'index.html')
    
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type:
        mime_type = 'text/html' if file_path.endswith('.html') else 'application/octet-stream'
    
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
        status = '200 OK'
        headers = [
            ('Content-Type', mime_type),
            ('Content-Length', str(len(content))),
            ('X-Content-Type-Options', 'nosniff')
        ]
        start_response(status, headers)
        return [content]
    except Exception as e:
        status = '500 Internal Server Error'
        headers = [('Content-Type', 'text/plain')]
        start_response(status, headers)
        return [f"Server Error: {str(e)}".encode('utf-8')]

app = application
