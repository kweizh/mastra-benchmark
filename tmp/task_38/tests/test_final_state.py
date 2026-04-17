import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/mastra-multi-model"
LOG_FILE = os.path.join(PROJECT_DIR, "output.log")
INDEX_FILE = os.path.join(PROJECT_DIR, "index.ts")
INDEX_JS_FILE = os.path.join(PROJECT_DIR, "index.js")

def test_project_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_index_file_contains_models():
    # Check if either index.ts or index.js exists
    target_file = None
    if os.path.isfile(INDEX_FILE):
        target_file = INDEX_FILE
    elif os.path.isfile(INDEX_JS_FILE):
        target_file = INDEX_JS_FILE
    
    assert target_file is not None, "Neither index.ts nor index.js found in the project directory."
    
    with open(target_file, "r") as f:
        content = f.read()
    
    assert "openai/gpt-4o" in content, "Model 'openai/gpt-4o' not found in the script."
    assert "anthropic/claude-3-5-sonnet-20240620" in content, "Model 'anthropic/claude-3-5-sonnet-20240620' not found in the script."

def test_script_execution():
    target_file = INDEX_FILE if os.path.isfile(INDEX_FILE) else INDEX_JS_FILE
    
    # Run the script using tsx or node
    if target_file.endswith(".ts"):
        cmd = ["npx", "tsx", target_file]
    else:
        cmd = ["node", target_file]
        
    result = subprocess.run(cmd, cwd=PROJECT_DIR, capture_output=True, text=True)
    assert result.returncode == 0, f"Script execution failed: {result.stderr}"

def test_output_log_exists_and_contains_responses():
    assert os.path.isfile(LOG_FILE), f"Log file {LOG_FILE} does not exist."
    
    with open(LOG_FILE, "r") as f:
        content = f.read()
        
    assert len(content.strip()) > 0, "Log file is empty."
    # Since we can't predict the exact output, we just check if there is some substantial content.
    assert len(content) > 10, "Log file content is too short to contain both responses."
