import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.txt")
INDEX_FILE = os.path.join(PROJECT_DIR, "index.ts")

def test_index_ts_exists_and_contains_agent_definition():
    assert os.path.isfile(INDEX_FILE), f"index.ts not found at {INDEX_FILE}"
    with open(INDEX_FILE, "r") as f:
        content = f.read()
    
    assert "chef-agent" in content, "Expected agent ID 'chef-agent' in index.ts."
    assert "openai/gpt-4o-mini" in content, "Expected model 'openai/gpt-4o-mini' in index.ts."
    assert "You are Michel, a professional French chef" in content, "Expected specific instructions in index.ts."

def test_script_execution_and_output():
    # Remove output file if it exists to ensure the script creates it
    if os.path.exists(OUTPUT_FILE):
        os.remove(OUTPUT_FILE)
        
    result = subprocess.run(
        ["npx", "tsx", "index.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"Script execution failed: {result.stderr}\n{result.stdout}"
    
    assert os.path.isfile(OUTPUT_FILE), f"Output file not created at {OUTPUT_FILE}"
    
    with open(OUTPUT_FILE, "r") as f:
        output_content = f.read().lower()
        
    assert "butter" in output_content, f"Expected 'butter' in output file, got: {output_content}"
