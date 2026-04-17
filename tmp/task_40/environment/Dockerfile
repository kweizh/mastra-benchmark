FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Mastra API agent task environment with Node.js v24 and a Python mock server."

RUN cat >/home/user/mock_server.py <<'EOF'
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/data':
            if self.headers.get('X-Custom-Auth') == 'secret-token':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'secret': 'harbor-validation-secret'}).encode('utf-8'))
            else:
                self.send_response(401)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8080), RequestHandler)
    server.serve_forever()
EOF

# Container contents:
#   - always required libs: curl ca-certificates git python3 python3-pip python3-pytest bash
#   - Node.js v24 for the Mastra agent
#   - /home/user/mock_server.py: Mock API server for testing custom headers

CMD ["/bin/bash", "-c", "python3 /home/user/mock_server.py & trap : TERM INT; sleep infinity & wait"]
