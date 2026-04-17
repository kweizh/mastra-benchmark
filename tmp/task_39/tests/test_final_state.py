import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"

def test_workflow_execution():
    """Priority 1: Run the workflow script and check exit code."""
    result = subprocess.run(
        ["npx", "tsx", "index.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, \
        f"Workflow execution failed: {result.stderr}"

def test_attempts_file_content():
    """Priority 3: Check the attempts file content."""
    attempts_file = os.path.join(PROJECT_DIR, "attempts.txt")
    assert os.path.isfile(attempts_file), f"Attempts file {attempts_file} does not exist."
    with open(attempts_file, "r") as f:
        content = f.read().strip()
    assert content == "3", f"Expected attempts.txt to contain '3', got: {content}"

def test_result_file_content():
    """Priority 3: Check the result file content."""
    result_file = os.path.join(PROJECT_DIR, "result.json")
    assert os.path.isfile(result_file), f"Result file {result_file} does not exist."
    with open(result_file, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            pytest.fail(f"Result file {result_file} is not valid JSON.")
    
    # Depending on how Mastra serializes the result, we check if it contains status: success
    # The workflow result might be nested or direct. We just check if the string representation contains it or if it's in the dict.
    content_str = json.dumps(data)
    assert "success" in content_str, f"Expected result.json to indicate success, got: {content_str}"
