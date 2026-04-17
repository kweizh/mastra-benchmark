import os
import subprocess
import json
import pytest
import time
import socket

PROJECT_DIR = "/home/user/monorepo"
MASTRA_DIR = os.path.join(PROJECT_DIR, "packages", "mastra-setup")

def test_tsconfig_module_resolution():
    tsconfig_path = os.path.join(MASTRA_DIR, "tsconfig.json")
    with open(tsconfig_path) as f:
        content = json.load(f)
    
    compiler_options = content.get("compilerOptions", {})
    module_res = compiler_options.get("moduleResolution", "").lower()
    assert module_res in ["bundler", "nodenext"], \
        f"Expected moduleResolution to be 'Bundler' or 'NodeNext', got: {module_res}"

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
    process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=MASTRA_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )
    
    if not wait_for_port(4111):
        import signal
        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
        pytest.fail("Mastra failed to start and listen on port 4111.")
    
    yield
    
    import signal
    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
    process.wait(timeout=30)

def test_server_running(start_app):
    # If the fixture succeeded, the port is open and the app is running.
    # We can also do a basic curl or just rely on the port check.
    result = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "http://localhost:4111/"], capture_output=True, text=True)
    # It might return 404 if no routes, but it should respond
    assert result.returncode == 0, f"Failed to curl localhost:4111. Output: {result.stderr}"
