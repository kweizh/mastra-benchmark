import os
import pytest
import subprocess

PROJECT_DIR = "/home/user/app"
SUPERVISOR_FILE = os.path.join(PROJECT_DIR, "src", "supervisor.ts")
RUN_FILE = os.path.join(PROJECT_DIR, "src", "run.ts")
DB_FILE = os.path.join(PROJECT_DIR, "mastra.db")
LOG_FILE = os.path.join(PROJECT_DIR, "output.log")

def test_supervisor_file_exists():
    assert os.path.isfile(SUPERVISOR_FILE), f"Supervisor file {SUPERVISOR_FILE} does not exist."

def test_run_file_exists():
    assert os.path.isfile(RUN_FILE), f"Execution script {RUN_FILE} does not exist."

def test_supervisor_agent_configuration():
    with open(SUPERVISOR_FILE, "r") as f:
        content = f.read()
    
    assert "coder-agent" in content or "coderAgent" in content, "coderAgent not found in supervisor.ts"
    assert "reviewer-agent" in content or "reviewerAgent" in content, "reviewerAgent not found in supervisor.ts"
    assert "supervisor" in content, "supervisor agent not found in supervisor.ts"
    assert "Memory" in content, "Memory instance not configured in supervisor.ts"
    assert "LibSQLStore" in content, "LibSQLStore not configured in supervisor.ts"
    assert "mastra.db" in content, "mastra.db not configured in LibSQLStore"

def test_run_script_execution():
    if not os.path.exists(LOG_FILE):
        # If the agent didn't run the script, we run it to verify it works
        result = subprocess.run(
            ["npx", "tsx", "src/run.ts"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True
        )
        assert result.returncode == 0, f"Execution of src/run.ts failed: {result.stderr}"

def test_mastra_db_exists():
    assert os.path.isfile(DB_FILE), f"Database file {DB_FILE} does not exist."

def test_output_log_exists():
    assert os.path.isfile(LOG_FILE), f"Log file {LOG_FILE} does not exist."

def test_output_log_content():
    with open(LOG_FILE, "r") as f:
        content = f.read().lower()
    
    assert "def " in content or "print" in content, "Python code not found in output.log"
