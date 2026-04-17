import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/myproject"

def test_project_initialized():
    package_json = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json), "package.json not found. Project was not initialized."
    with open(package_json, "r") as f:
        data = json.load(f)
    deps = data.get("dependencies", {})
    assert "@mastra/core" in deps or "@mastra/rag" in deps, "Mastra dependencies not found in package.json"

def test_index_ts_exists_and_uses_rag():
    index_path = os.path.join(PROJECT_DIR, "index.ts")
    assert os.path.isfile(index_path), "index.ts not found."
    with open(index_path, "r") as f:
        content = f.read()
    assert "@mastra/rag" in content or "Mastra" in content, "index.ts does not appear to use Mastra RAG."

def test_script_execution_and_output():
    # Run the script to ensure it works
    result = subprocess.run(
        ["npx", "tsx", "index.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Script execution failed: {result.stderr}"
    
    output_log = os.path.join(PROJECT_DIR, "output.log")
    assert os.path.isfile(output_log), "output.log not found."
    
    with open(output_log, "r") as f:
        log_content = f.read().lower()
        
    assert "plumbus" in log_content or "dinglebop" in log_content or "shleem" in log_content, \
        f"output.log does not contain expected information about a Plumbus. Content: {log_content}"
