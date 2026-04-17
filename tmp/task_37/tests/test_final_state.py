import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/mastra-workflow"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.json")

@pytest.fixture(scope="module", autouse=True)
def run_workflow_script():
    """Run the workflow script before executing tests."""
    result = subprocess.run(
        ["npx", "tsx", "index.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Script execution failed: {result.stderr}\n{result.stdout}"

def test_index_file_exists_and_imports():
    index_path = os.path.join(PROJECT_DIR, "index.ts")
    assert os.path.isfile(index_path), f"index.ts not found at {index_path}"
    
    with open(index_path) as f:
        content = f.read()
        
    assert "@mastra/core/workflows" in content, "Expected '@mastra/core/workflows' to be imported in index.ts."
    assert "zod" in content, "Expected 'zod' to be imported in index.ts."

def test_output_file_exists():
    assert os.path.isfile(OUTPUT_FILE), f"output.json not found at {OUTPUT_FILE}"

def test_output_file_contents():
    with open(OUTPUT_FILE) as f:
        data = json.load(f)
        
    assert data.get("id") == "123", f"Expected id to be '123', got {data.get('id')}"
    assert data.get("name") == "Alice", f"Expected name to be 'Alice', got {data.get('name')}"
    assert data.get("status") == "processed", f"Expected status to be 'processed', got {data.get('status')}"
