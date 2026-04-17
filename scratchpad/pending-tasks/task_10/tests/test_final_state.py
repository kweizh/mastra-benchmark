import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/mastra-rag"

def test_ingest_script_succeeds():
    """Priority 1: Run ingest script to populate the vector database."""
    result = subprocess.run(
        ["npx", "tsx", "ingest.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, \
        f"'npx tsx ingest.ts' failed: {result.stderr}"

def test_query_script_succeeds_and_returns_correct_answer():
    """Priority 1: Run query script and verify output."""
    query = "What is the main advantage of Mastra?"
    result = subprocess.run(
        ["npx", "tsx", "query.ts", query],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, \
        f"'npx tsx query.ts' failed: {result.stderr}"
    
    stdout = result.stdout.lower()
    assert "typescript frameworks" in stdout or "type safety" in stdout, \
        f"Expected 'TypeScript frameworks' or 'type safety' in output, got: {result.stdout}"
