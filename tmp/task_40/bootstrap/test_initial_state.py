import os
import shutil
import urllib.request
import pytest
from urllib.error import URLError

def test_node_installed():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_mock_server_running():
    req = urllib.request.Request(
        "http://localhost:8080/data",
        headers={"X-Custom-Auth": "secret-token"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            assert response.status == 200, "Mock server did not return 200 OK."
    except URLError as e:
        pytest.fail(f"Mock server is not running or unreachable: {e}")
