import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/mastra-api-agent"
LOG_FILE = os.path.join(PROJECT_DIR, "output.log")

def test_run_ts_executes_successfully():
    """Execute the agent script and verify it exits with 0."""
    result = subprocess.run(
        ["npx", "tsx", "run.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, \
        f"'npx tsx run.ts' failed with exit code {result.returncode}. Stderr: {result.stderr}\nStdout: {result.stdout}"

def test_output_log_contains_secret():
    """Verify that the agent correctly fetched and logged the secret data."""
    assert os.path.isfile(LOG_FILE), \
        f"Log file not found at {LOG_FILE}. The agent script did not create it."
    
    with open(LOG_FILE, "r") as f:
        content = f.read()
        
    assert "harbor-validation-secret" in content, \
        f"Expected 'harbor-validation-secret' in {LOG_FILE}, but got: {content}"
