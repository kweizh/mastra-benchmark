import os
import sqlite3
import pytest

PROJECT_DIR = "/home/user/research-assistant"
DB_FILE = os.path.join(PROJECT_DIR, "vector.db")
ANSWER_FILE = "/home/user/answer.txt"
ASK_SCRIPT = os.path.join(PROJECT_DIR, "src/ask.ts")

def test_project_dependencies_installed():
    package_json = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json), "package.json not found, project not initialized."
    
    with open(package_json, 'r') as f:
        content = f.read()
        
    assert "@mastra/core" in content, "@mastra/core not found in package.json"
    assert "@mastra/rag" in content, "@mastra/rag not found in package.json"
    assert "@mastra/libsql" in content, "@mastra/libsql not found in package.json"

def test_vector_db_exists_and_valid():
    assert os.path.isfile(DB_FILE), f"Vector database {DB_FILE} does not exist."
    
    # Check if it's a valid SQLite database by connecting to it
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        # Just a simple query to ensure it's a database
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        conn.close()
        # We expect at least some tables to exist if LibSQLVector initialized it
        assert len(tables) > 0, "Database exists but contains no tables."
    except sqlite3.Error as e:
        pytest.fail(f"Failed to open vector database as SQLite: {e}")

def test_ask_script_exists():
    assert os.path.isfile(ASK_SCRIPT), f"Script {ASK_SCRIPT} does not exist."

def test_answer_file_exists_and_contains_relevant_text():
    assert os.path.isfile(ANSWER_FILE), f"Output file {ANSWER_FILE} does not exist."
    
    with open(ANSWER_FILE, 'r') as f:
        content = f.read().lower()
        
    assert len(content) > 0, "Output file is empty."
    
    # The question is about the main advantages of the Transformer architecture.
    # The paper mentions: "superior in quality while being significantly more parallelizable and requiring significantly less time to train"
    keywords = ["parallel", "time", "train", "quality", "bleu", "attention", "recurr", "convolut"]
    matches = sum(1 for k in keywords if k in content)
    
    assert matches >= 2, f"Answer does not seem to contain relevant information about Transformer advantages. Found keywords: {[k for k in keywords if k in content]}"
