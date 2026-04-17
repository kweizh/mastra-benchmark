import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/mastra-app"

def test_script_execution():
    """Priority 1: Run the user's script and verify it exits successfully."""
    # Ensure the directory exists
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."
    
    # Run the script
    env = os.environ.copy()
    result = subprocess.run(
        ["npx", "tsx", "index.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR, env=env
    )
    assert result.returncode == 0, f"'npx tsx index.ts' failed: {result.stderr}\n{result.stdout}"

def test_employees_json_exists():
    """Priority 3: File existence check for employees.json."""
    json_path = os.path.join(PROJECT_DIR, "employees.json")
    assert os.path.isfile(json_path), f"employees.json not found at {json_path}"

def test_output_txt_contains_designer():
    """Priority 3: Verify the output file contains the expected word."""
    output_path = os.path.join(PROJECT_DIR, "output.txt")
    assert os.path.isfile(output_path), f"output.txt not found at {output_path}"
    
    with open(output_path, "r") as f:
        content = f.read()
    
    assert "Designer" in content or "designer" in content.lower(), \
        f"Expected 'Designer' in output.txt, got: {content}"
