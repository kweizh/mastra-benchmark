import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/mastra-project"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.json")
INDEX_FILE = os.path.join(PROJECT_DIR, "index.ts")

def test_script_execution_succeeds():
    """Priority 1: Run the user's script to verify it executes without error."""
    assert os.path.isfile(INDEX_FILE), f"index.ts not found at {INDEX_FILE}"
    
    result = subprocess.run(
        ["npx", "-y", "tsx", "index.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, \
        f"'npx tsx index.ts' failed: {result.stderr}"

def test_output_json_exists_and_correct():
    """Priority 3: Verify the output file contains the expected result."""
    assert os.path.isfile(OUTPUT_FILE), f"output.json not found at {OUTPUT_FILE}"
    
    with open(OUTPUT_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            pytest.fail(f"Failed to parse output.json as JSON: {e}")
            
    assert "result" in data, f"Expected 'result' key in output.json, got keys: {list(data.keys())}"
    assert data["result"] == "Escalated to human agent", \
        f"Expected result to be 'Escalated to human agent', got: {data['result']}"

def test_branch_logic_implemented():
    """Priority 3: Verify that the code uses .branch() from Mastra workflows."""
    with open(INDEX_FILE, "r") as f:
        content = f.read()
    
    assert ".branch(" in content or ".branch (" in content, \
        "Expected '.branch(' to be used in index.ts to implement conditional logic."
