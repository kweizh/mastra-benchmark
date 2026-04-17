import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/mastra-app"
OUTPUT_FILE = "/home/user/mastra-app/output.json"

def test_run_script_execution():
    """Priority 1: Run the script and check exit code."""
    # Ensure the script exists
    assert os.path.isfile(os.path.join(PROJECT_DIR, "run.ts")), "run.ts not found in /home/user/mastra-app"
    
    # Remove output file if it exists to ensure we are testing the new run
    if os.path.exists(OUTPUT_FILE):
        os.remove(OUTPUT_FILE)
        
    result = subprocess.run(
        ["npx", "tsx", "run.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx tsx run.ts' failed: {result.stderr}\nStdout: {result.stdout}"

def test_output_file_contents():
    """Priority 3 fallback: basic file existence and content check."""
    assert os.path.isfile(OUTPUT_FILE), f"Output file not found at {OUTPUT_FILE}"
    
    with open(OUTPUT_FILE, "r") as f:
        try:
            content = json.load(f)
        except json.JSONDecodeError:
            pytest.fail(f"Failed to parse JSON from {OUTPUT_FILE}")
            
    assert "result" in content, "Expected 'result' key in output.json"
    assert content["result"] == "Publish: Hello World", f"Expected 'Publish: Hello World', got: {content['result']}"
