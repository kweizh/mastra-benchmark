import os
import pytest

APP_DIR = "/home/user/app"
DATA_DIR = "/home/user/data"
OUTPUT_LOG = os.path.join(APP_DIR, "output.log")
HELLO_TXT = os.path.join(DATA_DIR, "hello.txt")

def test_script_ran_successfully():
    """Verify that the output.log exists, indicating the user ran the script."""
    assert os.path.isfile(OUTPUT_LOG), f"Expected execution log at {OUTPUT_LOG}."
    
def test_hello_file_exists():
    """Verify that the agent created the hello.txt file in the data directory."""
    assert os.path.isfile(HELLO_TXT), f"Expected {HELLO_TXT} to be created by the agent."

def test_hello_file_content():
    """Verify the content of the created hello.txt file."""
    if not os.path.isfile(HELLO_TXT):
        pytest.fail(f"Cannot check content because {HELLO_TXT} does not exist.")
        
    with open(HELLO_TXT, "r") as f:
        content = f.read().strip()
        
    assert "Hello from Mastra MCP" in content, f"Expected 'Hello from Mastra MCP' in {HELLO_TXT}, got: {content}"
