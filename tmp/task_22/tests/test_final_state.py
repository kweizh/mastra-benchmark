import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/myproject"
INDEX_FILE = os.path.join(PROJECT_DIR, "index.js")
DB_FILE = os.path.join(PROJECT_DIR, "mastra.db")

def test_index_file_exists_and_contains_libsql():
    """Priority 3: Verify the script contains the required configuration."""
    assert os.path.isfile(INDEX_FILE), f"index.js not found at {INDEX_FILE}"
    with open(INDEX_FILE, "r") as f:
        content = f.read()
    assert "LibSQLStore" in content, "Expected 'LibSQLStore' to be used in index.js."
    assert "file:mastra.db" in content, "Expected 'file:mastra.db' to be configured in index.js."

def test_db_file_exists_and_not_empty():
    """Priority 3: Verify that the database file was created, indicating successful execution."""
    assert os.path.isfile(DB_FILE), f"Database file not found at {DB_FILE}. Did you run the script?"
    assert os.path.getsize(DB_FILE) > 0, f"Database file {DB_FILE} is empty."
