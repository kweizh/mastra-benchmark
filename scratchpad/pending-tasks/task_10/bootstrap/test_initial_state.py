import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/mastra-rag"

def test_node_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_knowledge_file_exists():
    knowledge_path = os.path.join(PROJECT_DIR, "knowledge.md")
    assert os.path.isfile(knowledge_path), f"Knowledge file {knowledge_path} does not exist."

def test_knowledge_file_content():
    knowledge_path = os.path.join(PROJECT_DIR, "knowledge.md")
    with open(knowledge_path) as f:
        content = f.read()
    assert "TypeScript frameworks" in content, "Expected 'TypeScript frameworks' in knowledge.md."
