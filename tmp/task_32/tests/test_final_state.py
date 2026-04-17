import os
import subprocess
import time
import socket
import pytest
import urllib.request
import json

PROJECT_DIR = "/home/user/myproject"

def wait_for_port(port, timeout=60):
    start_time = time.time()
    while time.time() - start_time < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(('localhost', port)) == 0:
                return True
        time.sleep(5)
    return False

@pytest.fixture(scope="module")
def start_app():
    # Start the app
    process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=PROJECT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )
    
    # Wait for the app to be ready
    if not wait_for_port(3000):
        # Kill the process group before failing
        import signal
        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
        pytest.fail("App failed to start and listen on required ports.")
    
    yield
    
    # Shut down the app
    import signal
    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
    process.wait(timeout=30)

def test_api_chat_endpoint(start_app):
    req = urllib.request.Request(
        "http://localhost:3000/api/chat",
        data=json.dumps({"messages": [{"role": "user", "content": "Hello"}]}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            assert response.getcode() == 200, f"Expected status code 200, got {response.getcode()}"
            res_data = json.loads(response.read().decode("utf-8"))
            assert "success" in res_data or "message" in res_data or "text" in res_data or res_data, "Response should not be empty"
    except urllib.error.HTTPError as e:
        pytest.fail(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
    except Exception as e:
        pytest.fail(f"Request failed: {str(e)}")
