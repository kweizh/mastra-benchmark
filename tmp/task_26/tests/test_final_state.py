import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"
INDEX_FILE = os.path.join(PROJECT_DIR, "src", "index.ts")
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.txt")

def test_index_file_exists():
    assert os.path.isfile(INDEX_FILE), f"Expected index file at {INDEX_FILE}"

def test_index_file_contents():
    with open(INDEX_FILE, "r") as f:
        content = f.read()
    
    # Check imports
    assert "@mastra/core" in content, "Expected import from '@mastra/core'"
    assert "@mastra/memory" in content, "Expected import from '@mastra/memory'"
    
    # Check agents
    assert "coder" in content.lower(), "Expected 'coder' agent instantiation in index.ts"
    assert "reviewer" in content.lower(), "Expected 'reviewer' agent instantiation in index.ts"
    assert "supervisor" in content.lower(), "Expected 'supervisor' agent instantiation in index.ts"

def test_output_file_exists_and_contains_express():
    assert os.path.isfile(OUTPUT_FILE), f"Expected output file at {OUTPUT_FILE}"
    
    with open(OUTPUT_FILE, "r") as f:
        content = f.read().lower()
        
    assert "express" in content, "Expected the output file to contain 'express' server code"
    assert "app" in content or "server" in content, "Expected the output file to contain server code"
