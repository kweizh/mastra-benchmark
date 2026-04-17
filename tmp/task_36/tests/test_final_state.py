import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/app"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.txt")
DB_FILE = os.path.join(PROJECT_DIR, "mastra.db")
INDEX_FILE = os.path.join(PROJECT_DIR, "index.ts")

def test_run_script_succeeds():
    result = subprocess.run(
        ["npx", "tsx", "run.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx tsx run.ts' failed: {result.stderr}\nStdout: {result.stdout}"

def test_output_file_exists_and_contains_expected_text():
    assert os.path.isfile(OUTPUT_FILE), f"Output file {OUTPUT_FILE} does not exist."
    with open(OUTPUT_FILE, "r") as f:
        content = f.read().lower()
    
    assert "alice" in content, f"Expected 'Alice' in {OUTPUT_FILE}, got: {content}"
    assert "blue" in content, f"Expected 'blue' in {OUTPUT_FILE}, got: {content}"

def test_mastra_db_exists():
    assert os.path.isfile(DB_FILE), f"Database file {DB_FILE} does not exist. LibSQLStore was not used or not configured correctly."

def test_observational_memory_configured():
    assert os.path.isfile(INDEX_FILE), f"File {INDEX_FILE} does not exist."
    with open(INDEX_FILE, "r") as f:
        content = f.read()
    
    assert "observationalMemory: true" in content or "observationalMemory:true" in content or "observationalMemory : true" in content, \
        f"Expected 'observationalMemory: true' in {INDEX_FILE}."
