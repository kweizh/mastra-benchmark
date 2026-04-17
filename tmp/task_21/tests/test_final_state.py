import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/calculator-agent"
INDEX_FILE = os.path.join(PROJECT_DIR, "index.ts")
LOG_FILE = os.path.join(PROJECT_DIR, "output.log")

def test_index_file_exists_and_contains_imports():
    assert os.path.isfile(INDEX_FILE), f"index.ts not found at {INDEX_FILE}"
    with open(INDEX_FILE, "r") as f:
        content = f.read()
    assert "createTool" in content, "Expected 'createTool' to be imported or used in index.ts"
    assert "Agent" in content, "Expected 'Agent' to be imported or used in index.ts"

def test_script_execution_and_log_output():
    # Setup step: ensure npm install is run
    install_result = subprocess.run(
        ["npm", "install"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert install_result.returncode == 0, f"'npm install' failed: {install_result.stderr}"

    # Run the script
    run_result = subprocess.run(
        ["npx", "tsx", "index.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert run_result.returncode == 0, f"'npx tsx index.ts' failed: {run_result.stderr}"

    # Verify log file exists
    assert os.path.isfile(LOG_FILE), f"output.log not found at {LOG_FILE}"

    # Verify log content
    with open(LOG_FILE, "r") as f:
        log_content = f.read()
    assert "105" in log_content, f"Expected '105' in output.log, got: {log_content}"
