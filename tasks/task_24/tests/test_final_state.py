import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.json")
WORKFLOW_FILE = os.path.join(PROJECT_DIR, "src", "workflow.ts")

def test_workflow_uses_branch():
    """Verify that src/workflow.ts uses .branch()."""
    assert os.path.isfile(WORKFLOW_FILE), f"File {WORKFLOW_FILE} does not exist."
    with open(WORKFLOW_FILE, "r") as f:
        content = f.read()
    assert ".branch(" in content, "Expected '.branch(' to be used in src/workflow.ts."

def test_script_execution():
    """Run the script to generate output.json."""
    result = subprocess.run(
        ["npx", "tsx", "src/index.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Script execution failed: {result.stderr}"

def test_output_file_exists():
    """Verify that output.json exists."""
    assert os.path.isfile(OUTPUT_FILE), f"File {OUTPUT_FILE} does not exist."

def test_output_content():
    """Read output.json and verify its contents match the expected output."""
    with open(OUTPUT_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            pytest.fail(f"Failed to parse {OUTPUT_FILE} as JSON.")
    
    expected_data = [
        {"message": "High value: 15"},
        {"message": "Low value: 5"}
    ]
    
    assert data == expected_data, f"Expected {expected_data}, but got {data}"
